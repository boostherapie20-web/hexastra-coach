import Link from "next/link";

export default function Home() {
  return (
    <main className="hex-light">

      {/* NAVBAR */}

      <nav
        style={{
          maxWidth: 1200,
          margin: "40px auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          borderRadius: 20,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(0,0,0,0.05)"
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>HexAstra Coach</div>
          <div className="hx-small">Clarté · Timing · Respiration mentale</div>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          <a href="#fonctionnement">Comment ça marche</a>
          <a href="#usages">Usages</a>
          <a href="#tarifs">Tarifs</a>
        </div>

        <Link href="/chat" className="hx-btn hx-btn-primary">
          Accéder au chat
        </Link>
      </nav>

      {/* HERO */}

      <section
        style={{
          maxWidth: 1200,
          margin: "80px auto",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 60,
          alignItems: "center"
        }}
      >

        {/* TEXTE */}

        <div>

          <div className="hx-label">Clarté personnelle assistée par IA</div>

          <h1 className="hx-t1" style={{ marginTop: 16 }}>
            HexAstra t'aide à voir plus clair,
            sans te noyer dans la complexité.
          </h1>

          <p className="hx-body" style={{ marginTop: 20 }}>
            Une interface légère et premium pour comprendre ton moment,
            retrouver du calme intérieur et poser de meilleures décisions.
          </p>

          <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
            <Link href="/chat" className="hx-btn hx-btn-primary">
              Ouvrir le chat
            </Link>

            <a href="#fonctionnement" className="hx-btn hx-btn-ghost">
              Découvrir le fonctionnement
            </a>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 24
            }}
          >
            <div className="hx-chip">Je me sens bloqué en ce moment</div>
            <div className="hx-chip">Est-ce le bon timing pour agir ?</div>
            <div className="hx-chip">Pourquoi cette relation me travaille ?</div>
            <div className="hx-chip">Quelle direction devient naturelle ?</div>
          </div>

        </div>

        {/* PREVIEW CHAT */}

        <div className="hx-card">

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="hx-label">Aperçu du chat</div>
            <div style={{ color: "#10a37f" }}>● En ligne</div>
          </div>

          <div className="chat-ai-block" style={{ marginTop: 20 }}>
            Bienvenue. Dis-moi ce que tu veux éclaircir aujourd’hui.
          </div>

          <div
            style={{
              marginTop: 18,
              background: "#e7f6f1",
              padding: 16,
              borderRadius: 14
            }}
          >
            J’hésite entre rester dans mon activité actuelle ou lancer quelque chose de nouveau.
          </div>

          <div className="chat-ai-block" style={{ marginTop: 18 }}>
            On peut clarifier ça en 3 temps : ton état actuel,
            le vrai noeud de décision, puis le bon timing d’action.
          </div>

        </div>

      </section>

      {/* FONCTIONNEMENT */}

      <section
        id="fonctionnement"
        style={{
          maxWidth: 1100,
          margin: "120px auto"
        }}
      >

        <h2 className="hx-t2">Simple côté usage. Solide côté profondeur.</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 30,
            marginTop: 40
          }}
        >

          <div className="hx-card">
            <div className="hx-label">01</div>
            <h3 className="hx-t3">Tu entres dans le chat</h3>
            <p className="hx-body-sm">
              Un espace calme pour poser une question réelle
              sans surcharge inutile.
            </p>
          </div>

          <div className="hx-card">
            <div className="hx-label">02</div>
            <h3 className="hx-t3">HexAstra clarifie</h3>
            <p className="hx-body-sm">
              Le système écoute et reformule
              pour faire apparaître le vrai noeud.
            </p>
          </div>

          <div className="hx-card">
            <div className="hx-label">03</div>
            <h3 className="hx-t3">Tu vois plus clair</h3>
            <p className="hx-body-sm">
              Timing, direction, respiration mentale.
            </p>
          </div>

        </div>

      </section>

      {/* TARIFS */}

      <section
        id="tarifs"
        style={{
          maxWidth: 1100,
          margin: "120px auto"
        }}
      >

        <h2 className="hx-t2">
          Découvrir gratuitement, approfondir ensuite.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 24,
            marginTop: 40
          }}
        >

          <div className="hx-card">
            <div className="hx-label">Découverte</div>
            <div className="hx-t2">0€</div>
            <p className="hx-body-sm">
              Pour tester la qualité du dialogue HexAstra.
            </p>
            <Link href="/chat" className="hx-btn hx-btn-ghost">
              Accéder
            </Link>
          </div>

          <div className="hx-card">
            <div className="hx-label">Essentiel</div>
            <div className="hx-t2">9€/mois</div>
            <p className="hx-body-sm">
              Pour une pratique personnelle régulière.
            </p>
            <Link href="/chat" className="hx-btn hx-btn-primary">
              Accéder
            </Link>
          </div>

          <div className="hx-card">
            <div className="hx-label">Premium</div>
            <div className="hx-t2">19€/mois</div>
            <p className="hx-body-sm">
              Lectures plus profondes + exports.
            </p>
            <Link href="/chat" className="hx-btn hx-btn-primary">
              Accéder
            </Link>
          </div>

          <div className="hx-card">
            <div className="hx-label">Praticien</div>
            <div className="hx-t2">49€/mois</div>
            <p className="hx-body-sm">
              Outils avancés pour coachs et thérapeutes.
            </p>
            <Link href="/chat" className="hx-btn hx-btn-primary">
              Espace pro
            </Link>
          </div>

        </div>

      </section>

      {/* DISCLAIMER */}

      <div
        style={{
          maxWidth: 1100,
          margin: "100px auto",
          textAlign: "center"
        }}
        className="hx-small"
      >
        HexAstra Coach est un outil d'exploration personnelle.
        Il ne remplace pas un avis médical, juridique ou financier.
      </div>

    </main>
  );
}
