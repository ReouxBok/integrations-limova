import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileSpreadsheet, Loader2, Check, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useAgents } from "@/hooks/useAgents";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

interface ParsedRow {
  agent: string;
  problem: string;
  jamLink: string;
  isResolved: boolean;
  inProgress: string;
  noteType: string;
  isMandatory: boolean;
  followUp: string;
  secondaryJam: string;
  sourceTab: string;
}

interface MappedFeedback {
  agent_id: string | null;
  description: string;
  jam_link: string | null;
  secondary_jam_link: string | null;
  status: string;
  assigned_developer: string | null;
  bug_type: string | null;
  feedback_category: string;
  is_mandatory: boolean;
  follow_up_notes: string | null;
  date: string;
  client_email: string;
  criticality: string;
  team_member_id: string | null;
}

const AdminImportExcel = () => {
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: agents } = useAgents();
  const { data: teamMembers } = useTeamMembers();

  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [mappedData, setMappedData] = useState<MappedFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [defaultTeamMemberId, setDefaultTeamMemberId] = useState<string>("");

  if (!isAdmin) {
    navigate("/feedbacks");
    return null;
  }

  const parseExcelFile = async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      
      const allRows: ParsedRow[] = [];
      
      // Map sheet names to categories
      const sheetCategories: Record<string, string> = {
        "Bugs": "bug",
        "Features": "feature",
        "Bugs en prod": "bug_prod",
      };

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];
        
        // Skip header row
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as string[];
          if (!row || !row[0]) continue; // Skip empty rows
          
          const parsedRow: ParsedRow = {
            agent: String(row[0] || "").trim(),
            problem: String(row[1] || "").trim(),
            jamLink: String(row[2] || "").trim(),
            isResolved: String(row[3] || "").toLowerCase() === "oui" || String(row[3] || "").toLowerCase() === "yes",
            inProgress: String(row[4] || "").trim(),
            noteType: String(row[5] || "").trim(),
            isMandatory: String(row[6] || "").toLowerCase() === "mandatory" || String(row[6] || "").toLowerCase() === "oui",
            followUp: String(row[7] || "").trim(),
            secondaryJam: String(row[8] || "").trim(),
            sourceTab: sheetCategories[sheetName] || "bug",
          };
          
          if (parsedRow.problem) {
            allRows.push(parsedRow);
          }
        }
      }
      
      setParsedData(allRows);
      
      // Map to feedback structure
      const mapped = allRows.map((row): MappedFeedback => {
        // Find agent by name
        const matchedAgent = agents?.find(a => 
          a.name.toLowerCase() === row.agent.toLowerCase()
        );
        
        // Determine bug type from noteType
        let bugType: string | null = null;
        const noteTypeLower = row.noteType.toLowerCase();
        if (noteTypeLower.includes("backend") || noteTypeLower.includes("back")) {
          bugType = "backend";
        } else if (noteTypeLower.includes("frontend") || noteTypeLower.includes("front")) {
          bugType = "frontend";
        } else if (noteTypeLower.includes("ai") || noteTypeLower.includes("ia")) {
          bugType = "ai";
        } else if (noteTypeLower.includes("prompt")) {
          bugType = "prompt";
        }
        
        // Determine status
        let status = "new";
        if (row.isResolved) {
          status = "resolved";
        } else if (row.inProgress) {
          status = "in_progress";
        }
        
        // Determine criticality based on mandatory flag
        const criticality = row.isMandatory ? "critical" : "medium";
        
        return {
          agent_id: matchedAgent?.id || null,
          description: row.problem,
          jam_link: row.jamLink || null,
          secondary_jam_link: row.secondaryJam || null,
          status,
          assigned_developer: row.inProgress || null,
          bug_type: bugType,
          feedback_category: row.sourceTab,
          is_mandatory: row.isMandatory,
          follow_up_notes: row.followUp || null,
          date: new Date().toISOString().split('T')[0],
          client_email: "import@excel.com",
          criticality,
          team_member_id: null,
        };
      });
      
      setMappedData(mapped);
      
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      toast({
        title: t("Erreur de lecture", "Read Error"),
        description: t("Impossible de lire le fichier Excel", "Unable to read the Excel file"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      parseExcelFile(file);
    }
  };

  const handleImport = async () => {
    if (!mappedData.length) return;
    
    setIsImporting(true);
    
    try {
      // Add team_member_id to all feedbacks
      const feedbacksToInsert = mappedData.map(f => ({
        ...f,
        team_member_id: defaultTeamMemberId || null,
      }));
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from("feedbacks")
        .insert(feedbacksToInsert as any);
      
      if (error) throw error;
      
      toast({
        title: t("Import réussi", "Import Successful"),
        description: t(
          `${mappedData.length} feedbacks importés avec succès`,
          `${mappedData.length} feedbacks imported successfully`
        ),
      });
      
      navigate("/feedbacks");
      
    } catch (error: unknown) {
      console.error("Import error:", error);
      toast({
        title: t("Erreur d'import", "Import Error"),
        description: error instanceof Error ? error.message : t("Une erreur est survenue", "An error occurred"),
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    const styles: Record<string, string> = {
      bug: "bg-red-500/15 text-red-600 border-red-500/30",
      feature: "bg-blue-500/15 text-blue-600 border-blue-500/30",
      bug_prod: "bg-orange-500/15 text-orange-600 border-orange-500/30",
    };
    const labels: Record<string, string> = {
      bug: "🐛 Bug",
      feature: "✨ Feature",
      bug_prod: "🔥 Bug Prod",
    };
    return (
      <Badge variant="outline" className={styles[category] || ""}>
        {labels[category] || category}
      </Badge>
    );
  };

  return (
    <MainLayout title={t("Import Excel", "Excel Import")}>
      <div className="space-y-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              {t("Importer depuis Excel", "Import from Excel")}
            </CardTitle>
            <CardDescription>
              {t(
                "Importez des feedbacks depuis un fichier Excel (.xlsx) avec les onglets Bugs, Features, et Bugs en prod",
                "Import feedbacks from an Excel file (.xlsx) with Bugs, Features, and Bugs en prod tabs"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx,.xls"
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                variant="outline"
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {fileName || t("Sélectionner un fichier", "Select a file")}
              </Button>
              
              {parsedData.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t("Collaborateur par défaut:", "Default team member:")}
                    </span>
                    <Select
                      value={defaultTeamMemberId}
                      onValueChange={setDefaultTeamMemberId}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t("Sélectionner", "Select")} />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers?.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    onClick={handleImport}
                    disabled={isImporting || !defaultTeamMemberId}
                    className="gap-2"
                  >
                    {isImporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {t(`Importer ${mappedData.length} feedbacks`, `Import ${mappedData.length} feedbacks`)}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        {parsedData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t("Aperçu des données", "Data Preview")}</span>
                <Badge variant="secondary">{parsedData.length} {t("lignes", "rows")}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Catégorie", "Category")}</TableHead>
                      <TableHead>{t("Agent", "Agent")}</TableHead>
                      <TableHead className="min-w-[300px]">{t("Description", "Description")}</TableHead>
                      <TableHead>{t("Jam", "Jam")}</TableHead>
                      <TableHead>{t("Statut", "Status")}</TableHead>
                      <TableHead>{t("Assigné", "Assigned")}</TableHead>
                      <TableHead>{t("Type", "Type")}</TableHead>
                      <TableHead>{t("Mandatory", "Mandatory")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappedData.slice(0, 20).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{getCategoryBadge(row.feedback_category)}</TableCell>
                        <TableCell>
                          {row.agent_id ? (
                            <span className="text-green-600">✓ {parsedData[index]?.agent}</span>
                          ) : (
                            <span className="text-yellow-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {parsedData[index]?.agent || "-"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {row.description.slice(0, 80)}...
                        </TableCell>
                        <TableCell>
                          {row.jam_link ? (
                            <a href={row.jam_link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                              Jam
                            </a>
                          ) : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            row.status === "resolved" ? "bg-green-500/15 text-green-600" :
                            row.status === "in_progress" ? "bg-purple-500/15 text-purple-600" :
                            "bg-blue-500/15 text-blue-600"
                          }>
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.assigned_developer || "-"}</TableCell>
                        <TableCell>{row.bug_type || "-"}</TableCell>
                        <TableCell>
                          {row.is_mandatory && (
                            <Badge variant="destructive">🚨</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {mappedData.length > 20 && (
                  <p className="text-center text-muted-foreground mt-4">
                    {t(`... et ${mappedData.length - 20} autres lignes`, `... and ${mappedData.length - 20} more rows`)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminImportExcel;
