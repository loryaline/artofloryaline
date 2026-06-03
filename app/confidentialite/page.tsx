import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Politique de confidentialité — Art of LoryAline",
  description: "Comment vos données personnelles sont protégées sur artofloryaline.ch",
};

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité" updated="juin 2026">
      <p className="italic text-sm">
        La présente politique décrit comment vos données personnelles sont collectées, utilisées
        et protégées lorsque vous utilisez le site artofloryaline.ch. Elle est conforme au
        Règlement Général sur la Protection des Données (RGPD) et à la Loi suisse sur la
        protection des données (LPD).
      </p>

      <section>
        <h2>1. Responsable du traitement</h2>
        <p>
          <strong>Lory Aline Cherpit — Chênerève Editions</strong>{" "}(Art of LoryAline)<br />
          Rue de la Poterie 6, Suisse<br />
          Email : <a href="mailto:la@artofloryaline.ch">la@artofloryaline.ch</a>
        </p>
      </section>

      <section>
        <h2>2. Données collectées</h2>
        <p>
          Ce site est un portfolio. Il ne crée pas de compte, ne vend rien en ligne et ne traite
          aucun paiement. Les seules données collectées le sont lorsque vous remplissez
          volontairement le <strong>formulaire de demande de devis</strong>{" "}:
        </p>
        <ul>
          <li><strong>Nom / pseudo</strong></li>
          <li><strong>Adresse email</strong>{" "}(pour vous répondre)</li>
          <li><strong>Détails du projet</strong>{" "}: format souhaité, description, références éventuelles</li>
        </ul>
        <p>
          Aucune donnée n&apos;est collectée à votre insu, et le site n&apos;utilise pas de cookies
          publicitaires ni d&apos;outils de mesure d&apos;audience tiers.
        </p>
      </section>

      <section>
        <h2>3. Finalité &amp; base légale</h2>
        <p>
          Les données du formulaire sont utilisées <strong>uniquement</strong>{" "}pour traiter votre
          demande, établir un devis et échanger avec vous au sujet de votre projet. La base légale
          est l&apos;exécution de mesures précontractuelles prises à votre demande.
        </p>
      </section>

      <section>
        <h2>4. Destinataires &amp; sous-traitants</h2>
        <p>Vos données sont transmises uniquement aux prestataires nécessaires :</p>
        <ul>
          <li><strong>Web3Forms</strong>{" "}— achemine le contenu du formulaire vers la boîte mail de l&apos;artiste.</li>
          <li><strong>Vercel</strong>{" "}(USA) — hébergement du site.</li>
          <li><strong>Infomaniak</strong>{" "}(Suisse) — hébergement de la messagerie.</li>
          <li><strong>Instagram / Meta</strong>{" "}— uniquement si vous visualisez les vidéos intégrées ; Instagram peut déposer ses propres cookies à ce moment.</li>
        </ul>
        <p>
          Vos données ne sont ni vendues, ni cédées à des tiers à des fins commerciales.
        </p>
      </section>

      <section>
        <h2>5. Durée de conservation</h2>
        <p>
          Les demandes reçues par email sont conservées le temps nécessaire au traitement de
          votre projet et à nos obligations comptables/légales, puis supprimées sur demande.
        </p>
      </section>

      <section>
        <h2>6. Vos droits</h2>
        <p>Conformément au RGPD et à la LPD, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Accès</strong>{" "}— recevoir une copie de vos données</li>
          <li><strong>Rectification</strong>{" "}— corriger des données inexactes</li>
          <li><strong>Effacement</strong>{" "}— supprimer vos données</li>
          <li><strong>Opposition</strong>{" "}et <strong>limitation</strong>{" "}du traitement</li>
        </ul>
        <p>
          Pour exercer ces droits : <a href="mailto:la@artofloryaline.ch">la@artofloryaline.ch</a>.
        </p>
        <p>
          Vous pouvez aussi saisir l&apos;autorité de contrôle compétente :
        </p>
        <ul>
          <li><strong>Suisse</strong>{" "}: Préposé fédéral à la protection des données et à la transparence (PFPDT) — <a href="https://www.edoeb.admin.ch" target="_blank" rel="noopener noreferrer">edoeb.admin.ch</a></li>
          <li><strong>France</strong>{" "}: CNIL — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">cnil.fr</a></li>
        </ul>
      </section>

      <section>
        <h2>7. Sécurité</h2>
        <p>
          Le site est servi en HTTPS (chiffrement TLS). Les échanges via le formulaire transitent
          de façon sécurisée. Aucun mot de passe ni donnée bancaire n&apos;est collecté.
        </p>
      </section>

      <section>
        <h2>8. Modifications</h2>
        <p>
          Cette politique peut être mise à jour. La date de dernière mise à jour figure en haut
          de page.
        </p>
      </section>
    </LegalPage>
  );
}
