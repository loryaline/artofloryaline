import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Mentions légales — Art of LoryAline",
  description: "Informations légales relatives au site artofloryaline.ch",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" updated="juin 2026">
      <section>
        <h2>1. Éditeur du site</h2>
        <p><strong>Art of LoryAline</strong></p>
        <p>
          Lory Aline Cherpit — <strong>Chênerève Editions</strong>{" "}(raison individuelle)<br />
          Rue de la Poterie 6<br />
          Suisse<br />
          Email : <a href="mailto:la@artofloryaline.ch">la@artofloryaline.ch</a>
        </p>
        <p>
          <strong>Statut juridique :</strong>{" "}entreprise individuelle (Chênerève Editions)
        </p>
        <p>
          <strong>Responsable de la publication :</strong>{" "}Lory Aline Cherpit
        </p>
      </section>

      <section>
        <h2>2. Hébergement</h2>
        <p>
          Le site est hébergé par :<br />
          <strong>Vercel Inc.</strong><br />
          440 N Barranca Avenue #4133, Covina, CA 91723, USA<br />
          Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
        </p>
        <p>
          La messagerie du domaine est hébergée par <strong>Infomaniak Network SA</strong>
          {" "}(Genève, Suisse) — <a href="https://www.infomaniak.com" target="_blank" rel="noopener noreferrer">infomaniak.com</a>.
        </p>
      </section>

      <section>
        <h2>3. Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu de ce site (illustrations, textes, mise en page, design
          graphique, vidéos) est la propriété exclusive de Lory Aline Cherpit (Art of LoryAline),
          sauf mention contraire. Toute reproduction, représentation, modification, publication
          ou adaptation, totale ou partielle, est interdite sans autorisation écrite préalable,
          conformément au droit d&apos;auteur suisse et international.
        </p>
        <p>
          Les œuvres présentées sont protégées par le droit d&apos;auteur. La cession de droits
          d&apos;exploitation fait l&apos;objet d&apos;un contrat spécifique : tout droit non explicitement
          cédé reste la propriété de l&apos;artiste. Le droit moral est incessible — le nom de
          l&apos;autrice doit figurer et l&apos;œuvre ne peut être dénaturée.
        </p>
        <p>
          <strong>Engagement :</strong>{" "}aucune image générée par intelligence artificielle
          n&apos;est utilisée dans les œuvres finies et délivrées. Chaque réalisation est entièrement
          créée à la main par l&apos;artiste.
        </p>
      </section>

      <section>
        <h2>4. Services tiers utilisés</h2>
        <ul>
          <li><strong>Vercel</strong>{" "}— hébergement du site web (USA)</li>
          <li><strong>Infomaniak</strong>{" "}— hébergement de la messagerie (Suisse)</li>
          <li><strong>Web3Forms</strong>{" "}— acheminement des demandes envoyées via le formulaire de devis</li>
          <li><strong>Instagram / Meta</strong>{" "}— affichage des vidéos (timelapses) intégrées sur le site</li>
        </ul>
        <p>
          Pour le détail du traitement de vos données, consultez la{" "}
          <a href="/confidentialite">Politique de confidentialité</a>.
        </p>
      </section>

      <section>
        <h2>5. Contact</h2>
        <p>
          Pour toute question : <a href="mailto:la@artofloryaline.ch">la@artofloryaline.ch</a>
        </p>
      </section>
    </LegalPage>
  );
}
