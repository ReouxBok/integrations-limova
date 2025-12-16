# Scripts de récupération des logos

## fetch-logos.mjs

Ce script télécharge automatiquement les logos de toutes les intégrations depuis plusieurs sources CDN et les sauvegarde localement dans `public/integration-logos/`.

### Utilisation

```bash
npm run fetch:logos
```

### Fonctionnement

Le script :
1. Lit la liste de toutes les intégrations depuis `src/lib/all-integration-slugs.ts`
2. Pour chaque intégration, essaie de télécharger le logo depuis plusieurs sources (dans l'ordre) :
   - **Simple Icons** (pour les marques connues)
   - **jsDelivr Pipedream** (repo GitHub officiel)
   - **Pipedream CDN** (s.v0)
   - **Clearbit** (pour certains domaines)
3. Sauvegarde les logos trouvés dans `public/integration-logos/{slug}.png` ou `.svg`
4. Génère un fichier `missing-logos.txt` avec la liste des logos introuvables

### Résultat

- ✅ Les logos téléchargés sont automatiquement utilisés par le composant `IntegrationLogo`
- ⏭️ Les logos déjà présents sont ignorés (pas de re-téléchargement)
- ❌ Les logos manquants sont listés dans `missing-logos.txt` pour curation manuelle

### Notes

- Le script prend du temps (plusieurs minutes) car il traite **4044 intégrations**
- Un délai de 50ms est ajouté entre chaque requête pour éviter de surcharger les serveurs
- Les logos sont prioritaires dans le composant React : **local → CDN → lettre colorée**

