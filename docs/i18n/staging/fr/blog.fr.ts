/**
 * Blog article bodies (French) — inventory module F.
 *
 * Mirrors POST_BODIES from `src/content/blog.ts`: same 11 slugs, same block
 * order, same `kind` values. Only `body[].text` is translated; `author` becomes
 * the natural French team byline, and `publishedISO`/`readMinutes` are verbatim.
 *
 * Card title/summary/image alt come from landing.ts `stories` (module G), not here.
 *
 * Typography: authored with natural French punctuation (regular spaces); a final
 * Node normalization pass inserts real U+00A0 before « ; : ! ? » and inside guillemets.
 */
import type { BlogPostMeta, BlogBlock } from "@/content/blog";

const p = (text: string): BlogBlock => ({ kind: "p", text });
const h2 = (text: string): BlogBlock => ({ kind: "h2", text });

export const postBodiesFr: Record<string, BlogPostMeta> = {
  "cairo-beyond-the-guidebook": {
    author: "L’équipe Ptah Tours",
    publishedISO: "2026-03-12",
    readMinutes: 6,
    body: [
      p("Le Caire déroute les nouveaux venus, et c’est une part de son charme. Quelque vingt millions d’habitants, un fleuve plus ancien que l’histoire, et une circulation qui transforme un trajet de deux miles en aventure. Le guide de voyage vous enverra aux pyramides et au Musée égyptien — et vous devez absolument y aller. Mais le Caire que nous aimons est celui que l’on découvre dans les heures qui séparent ces visites."),
      h2("Manger là où mangent les Cairotes"),
      p("Le koshari, c’est la ville dans une assiette : riz, lentilles, pâtes, pois chiches, oignons frits croustillants et une sauce tomate relevée à l’ail, assemblés à toute vitesse et mangés debout. Délaissez les cafés à touristes et suivez plutôt la file des employés de bureau à l’heure du déjeuner. Le meilleur koshari est bruyant, bon marché, et servi avec une bouteille de sauce piquante que vous traiterez avec respect."),
      p("Le soir, les vieilles boulangeries à fatir et les carrioles de foul et de taameya prennent tout leur sens. La cuisine de rue égyptienne compte parmi les plus savoureuses de la région, et bien la déguster tient surtout à aller là où c’est fréquenté et fraîchement préparé."),
      h2("Trouver le coucher de soleil"),
      p("Tout le monde photographie les pyramides au coucher du soleil. Moins nombreux sont ceux qui montent jusqu’à la citadelle de Saladin, où la mosquée de Méhémet Ali couronne l’horizon et où la ville entière se déploie en contrebas dans la lumière dorée et basse. Lorsque l’appel à la prière s’élève au-dessus des toits, c’est l’une des grandes expériences gratuites du Caire."),
      h2("Les salles paisibles du musée"),
      p("Les salles célèbres du Musée égyptien sont incontournables, mais les arrière-salles récompensent la patience : des vitrines d’objets du quotidien — sandales, peignes, jouets d’enfants, la palette d’un scribe — qui rendent le monde antique soudain, et bouleversant d’humanité. Nos guides adorent ces recoins, et une matinée prise lentement ici vaut mieux qu’une heure expédiée."),
      p("Le Caire ne se livre pas facilement. Accordez-lui quelques jours, un bon guide et de l’appétit, et il devient la ville où vous voudrez revenir."),
    ],
  },
  "karnak-sound-and-light": {
    author: "L’équipe Ptah Tours",
    publishedISO: "2026-04-02",
    readMinutes: 5,
    body: [
      p("Le spectacle son et lumière de Karnak a une réputation, et pas toujours flatteuse. Certains voyageurs le rejettent comme un numéro de théâtre daté. Bien mené — et bien programmé — c’est l’une des soirées les plus envoûtantes que l’on puisse vivre à Louxor."),
      h2("Le moment fait tout"),
      p("Toute l’astuce tient à la foule. Nous organisons les visites de sorte que, à mesure que le spectacle progresse à travers le temple, nos voyageurs atteignent la grande salle hypostyle lorsqu’elle est presque vide. Se tenir parmi 134 colonnes colossales dans l’obscurité, éclairées section après section, tandis que la narration résonne contre une pierre vieille de trois mille ans — voilà l’instant dont les gens se souviennent."),
      h2("Ce que la mise en lumière réussit"),
      p("Dites ce que vous voudrez du texte, la conception lumineuse comprend l’architecture. Observez comme les obélisques accrochent la lumière et semblent s’élever ; comme un bain de couleur révèle un mur de hiéroglyphes devant lequel vous seriez passé sans le voir en plein jour. Karnak a été bâti pour mettre en scène le drame du divin, et la nuit tombée il le fait encore."),
      h2("Associez-le à une visite de jour"),
      p("Le spectacle fonctionne mieux comme seconde visite. Voyez d’abord Karnak à la lumière du jour — prenez vos repères, laissez votre guide vous présenter les pharaons qui, chacun, y ont laissé leur marque au fil de deux mille ans — puis revenez la nuit pour le ressentir plutôt que l’étudier. De jour, vous comprenez Karnak. De nuit, vous pressentez pourquoi il a compté."),
    ],
  },
  "alexandria-mediterranean-soul": {
    author: "L’équipe Ptah Tours",
    publishedISO: "2026-04-20",
    readMinutes: 6,
    body: [
      p("À deux heures au nord du Caire, l’Égypte change d’avis. La lumière du désert s’adoucit en brume marine, le café se corse, et une brise salée arrive de la Méditerranée. Alexandrie a toujours regardé vers le large — vers la Grèce, vers Rome, vers la mer plus vaste — et elle donne encore l’impression d’un autre pays sous le même drapeau."),
      h2("Commencez au bord de l’eau"),
      p("La Corniche est le salon de la ville. Parcourez-la en fin d’après-midi, quand la lumière fait virer la mer à l’argent et que les pêcheurs relèvent leurs lignes, et vous comprendrez chaque Alexandrin nostalgique que vous avez pu croiser. La courbe de la baie vers la citadelle est l’une des grandes promenades urbaines d’Égypte."),
      h2("La bibliothèque, ancienne et nouvelle"),
      p("L’antique bibliothèque d’Alexandrie a disparu depuis longtemps, mais sa remplaçante moderne — la Bibliotheca Alexandrina — est un bâtiment saisissant qui vaut bien une heure, écho délibéré du rôle de la ville comme foyer de savoir. C’est un rappel que l’histoire d’Alexandrie est autant affaire d’idées que de monuments."),
      h2("Descendre dans les catacombes"),
      p("Les catacombes de Kôm el-Chogafa sont le trésor le plus étrange de la ville : un complexe funéraire d’époque romaine sur plusieurs niveaux, s’enfonçant en spirale sous terre, où les styles égyptien, grec et romain se fondent sur les mêmes parois sculptées. Nulle part ailleurs l’identité métisse et méditerranéenne d’Alexandrie ne se saisit aussi pleinement."),
      h2("Et les fruits de mer"),
      p("Terminez au marché aux poissons, où vous choisissez votre prise et où on vous la cuisine simplement et superbement. Poisson grillé, un filet de citron, du pain et des salades, la mer à quelques mètres — voilà le repas qui donne aux gens l’envie irrésistible de revenir."),
    ],
  },
  "red-sea-reef-etiquette": {
    author: "L’équipe Ptah Tours",
    publishedISO: "2026-05-08",
    readMinutes: 5,
    body: [
      p("Les récifs de la mer Rouge comptent parmi les plus sains et les plus beaux du monde — et les préserver ainsi tient en partie à ceux qui viennent les voir. Un bon snorkeling ne tient pas seulement à ce que l’on voit ; il tient à la légèreté avec laquelle on s’y déplace. Voici comment font nos guides de plongée."),
      h2("Maîtrisez votre flottabilité"),
      p("La chose la plus utile que vous puissiez faire pour un récif, c’est de ne pas le toucher. Un coup de palme qui soulève le sable, une main posée pour se stabiliser sur le corail — de petits contacts finissent par causer de réels dégâts au fil de milliers de visiteurs. Restez à l’horizontale, gardez vos palmes relevées et derrière vous, et flottez plutôt que de vous tenir debout. Si vous débutez, dites-le à votre guide ; il vous aidera d’abord à trouver votre équilibre dans les hauts-fonds."),
      h2("Ne nourrissez jamais les poissons"),
      p("C’est tentant, et c’est nuisible. Le nourrissage modifie le comportement des poissons, fausse le fragile équilibre du récif et habitue les animaux à l’homme de façons qui finissent mal pour eux. Sur chaque bateau Ptah, la règle est simple : on regarde, on ne nourrit pas."),
      h2("La crème solaire compte"),
      p("Beaucoup de crèmes solaires courantes contiennent des substances nocives pour le corail. Nous demandons à chacun d’utiliser une crème minérale, respectueuse des récifs — ou mieux encore, de se couvrir avec un haut anti-UV et de laisser le tissu faire le travail. Ce que vous mettez sur votre peau finit dans l’eau."),
      h2("Où trouver une eau tranquille"),
      p("Les sites célèbres le sont pour de bonnes raisons, mais ils sont fréquentés. Près de Charm en particulier, il existe des récifs plus paisibles où vous partagerez l’eau avec presque personne — nos guides les connaissent, et savent programmer une sortie pour que le récif soit un peu plus à vous. Un récif plus calme est un meilleur récif, pour vous comme pour lui."),
    ],
  },
  "slow-nile-felucca-days": {
    author: "L’équipe Ptah Tours",
    publishedISO: "2026-05-24",
    readMinutes: 4,
    body: [
      p("On peut voir énormément de l’Égypte à vive allure — temple après temple, tombeau après tombeau, en cochant les merveilles. Mais certaines des plus belles heures du voyage surviennent quand on cesse tout à fait de vouloir voir quoi que ce soit. En tête de liste : un après-midi sur une felouque."),
      h2("Pas de moteur, pas d’horaire"),
      p("La felouque est un voilier de bois traditionnel, mû par le seul vent et le savoir-faire. Aucun moteur pour vous presser, aucune route fixe au-delà de ce que la brise autorise. À Assouan, où le Nil est au plus beau — îles, blocs de granit, voiles blanches se détachant sur le désert — c’est la manière d’être sur l’eau."),
      h2("Le rythme du fleuve"),
      p("Installez-vous sur les coussins, laissez traîner une main dans l’eau, et laissez le capitaine faire ce que les felouques font ici depuis des siècles. Un thermos de thé chaud et sucré apparaît. Les oiseaux travaillent les hauts-fonds. La lumière glisse vers l’or. La conversation ralentit, puis s’arrête, et personne ne s’en plaint."),
      h2("Pourquoi nous l’intégrons"),
      p("Nous pourrions remplir cet après-midi par un site de plus. Nous choisissons de ne pas le faire. Une lente navigation en felouque est le contrepoids d’un itinéraire chargé — le moment qui laisse tout ce que vous avez vu se déposer, et le souvenir qui remonte en premier quand, des mois plus tard, les gens racontent leur voyage. L’Égypte récompense le voyageur qui, de temps à autre, ne fait rien, magnifiquement."),
    ],
  },
  "best-time-to-visit-egypt": {
    author: "L’équipe Ptah Tours",
    publishedISO: "2026-09-15",
    readMinutes: 7,
    body: [
      p("Il n’existe pas un unique meilleur moment pour visiter l’Égypte — seulement le meilleur moment pour le voyage que vous avez en tête. Les hivers doux conviennent aux temples et aux tombeaux ; les mois d’intersaison échangent un peu de chaleur contre moins de monde et un meilleur rapport qualité-prix ; et même le plein été a ses récompenses si l’on s’organise autour du soleil. Voici à quoi ressemble vraiment l’année sur le terrain."),
      h2("L’hiver (de novembre à février) : la saison classique"),
      p("C’est la haute saison, et à juste titre. Les journées sont chaudes et dégagées, les soirées fraîches, et parcourir les sites en plein air de Gizeh, Louxor et Assouan est réellement agréable. La contrepartie, c’est le monde : les sites célèbres sont alors les plus fréquentés, et les prix des croisières et des hôtels au plus haut. Réservez tôt, commencez vos journées de visite dès l’ouverture, et le seul vrai inconvénient de la saison s’efface presque entièrement."),
      h2("Le printemps et l’automne (mars, avril, octobre) : le juste milieu"),
      p("Les mois d’intersaison sont nos favoris discrets. Le temps reste clément, la foule s’éclaircit, et le rapport qualité-prix s’améliore nettement. Le printemps s’accompagne d’une réserve — le khamsin, un vent chaud et poussiéreux qui peut souffler un jour ou deux entre mars et mai. Il passe vite, et une matinée souple s’en accommode aisément. Pour la plupart des voyageurs, ces semaines offrent le meilleur équilibre de tous."),
      h2("L’été (de mai à septembre) : chaud, bon marché et plus tranquille qu’on ne le croit"),
      p("L’été en Haute-Égypte est réellement chaud, et nous ne prétendrons pas le contraire. Mais c’est aussi la période la moins chère et la moins fréquentée pour voyager, et elle se gère très bien avec le bon rythme : visitez à l’aube, reposez-vous durant les heures brûlantes de midi, et ressortez quand le jour se rafraîchit. Une croisière sur le Nil, avec son pont ombragé et sa brise de rivière, est une manière particulièrement astucieuse de découvrir le Sud en été."),
      h2("Pour la mer Rouge"),
      p("La côte suit son propre calendrier. Hurghada, Charm el-Cheikh et Marsa Alam sont chaudes et propices à la baignade toute l’année, avec l’eau la plus chaude de juin à octobre. L’hiver y est agréable pour la plongée et le snorkeling aussi, simplement avec une combinaison et, ici ou là, une journée venteuse. Si la plage est le cœur de votre voyage, presque n’importe quel mois convient."),
      h2("Alors, quand partir ?"),
      p("Partez en hiver pour le temps de visite le plus agréable. Partez à l’intersaison, au printemps ou à l’automne, pour le meilleur équilibre général entre climat, coût et tranquillité. Partez en été si le budget prime, ou si vous mettez le cap sur la mer Rouge. Quel que soit votre choix, nous calons le rythme quotidien sur la saison — et c’est cela, plus que le calendrier, qui rend un voyage sans effort."),
    ],
  },
  "first-time-nile-cruise": {
    author: "L’équipe Ptah Tours",
    publishedISO: "2026-08-28",
    readMinutes: 7,
    body: [
      p("Une croisière sur le Nil est la plus ancienne façon de voir l’Égypte, et la meilleure encore aujourd’hui. Pendant quelques jours, le fleuve voyage pour vous : les temples arrivent sur la berge, le paysage défile le long du pont, et la logistique qui rend un circuit terrestre fatigant se dissout tout simplement. Si vous n’en avez jamais fait, voici à quoi vous attendre."),
      h2("Le rythme quotidien"),
      p("La vie à bord s’installe dans une cadence tranquille. Les petits matins sont pour les grands sites, avant la chaleur et la foule ; les milieux de journée pour la navigation, le déjeuner et le pont-soleil ; les fins d’après-midi apportent un nouveau temple ou une paisible étendue d’eau. Les repas sont généralement servis en buffet et copieux, les soirées détendues, et l’ensemble ne vous demande presque rien, sinon de vous présenter et de regarder au-dehors."),
      h2("Quel sens, et pour combien de temps"),
      p("La plupart des croisières relient Louxor et Assouan, et les formules standard sont de trois ou quatre nuits. Naviguer vers le sud depuis Louxor ou vers le nord depuis Assouan couvre les mêmes grands sites — Karnak et la vallée des Rois côté Louxor, Edfou et Kôm Ombo au milieu, Philae près d’Assouan — choisissez donc selon la ville où vous préférez arriver et repartir en avion. Quatre nuits laissent à chaque chose un peu plus d’air pour respirer."),
      h2("Bateau de croisière ou dahabieh ?"),
      p("Les grands bateaux fluviaux sont confortables et conviviaux, avec piscines, plusieurs ponts et quelques centaines de compagnons de voyage. La dahabieh est l’alternative intime : un petit voilier de quelques cabines, sans foule, au rythme plus lent porté par le vent, plus proche de la façon dont on a toujours parcouru le fleuve. Les bateaux conviennent à qui aime les équipements et la compagnie ; les dahabiehs, à qui recherche le calme et le romanesque. Ni l’un ni l’autre n’a tort."),
      h2("Choisir sa cabine"),
      p("Dépensez un peu plus pour un pont élevé et une vraie fenêtre ou un balcon si vous le pouvez — la vue est tout l’intérêt, et vous passerez à la contempler plus de temps que vous ne l’imaginez. Les cabines sont en général compactes mais bien tenues ; vous n’y êtes pas beaucoup."),
      h2("Quelques conseils honnêtes"),
      p("Emportez une couche légère pour les soirées venteuses sur le pont et un bon chapeau de soleil pour la journée. Les pourboires sont d’ordinaire mis en commun pour l’équipage et réglés à la fin ; demandez à votre guide ce qui se fait. Et résistez à l’envie de surcharger l’itinéraire — les heures de navigation, quand rien n’est prévu et que la vallée glisse au fil de l’eau, sont celles dont vous vous souviendrez le plus."),
    ],
  },
  "seven-days-in-egypt": {
    author: "L’équipe Ptah Tours",
    publishedISO: "2026-08-10",
    readMinutes: 8,
    body: [
      p("Sept jours, c’est le format idéal pour un premier voyage en Égypte : assez long pour voir Le Caire, Louxor et Assouan comme il faut, assez court pour tenir dans une durée de congés normale. Le secret d’une semaine qui semble pleine plutôt que frénétique, c’est de savoir quoi laisser de côté. Voici l’itinéraire classique que nous proposons, jour par jour, et les arbitrages qui le sous-tendent."),
      h2("Jours 1–2 : Le Caire et Gizeh"),
      p("Atterrissez au Caire et plongez sans attendre. Les pyramides de Gizeh et le Sphinx s’imposent pour la première matinée, idéalement associés au Grand Musée égyptien, dont les galeries rassemblent désormais les trésors en un même lieu extraordinaire. Le deuxième jour est pour la pyramide à degrés de Saqqarah et les ruines de Memphis, puis pour le dédale du Caire islamique et copte — mosquées, églises, le bazar de Khan el-Khalili — la ville vivante derrière les monuments."),
      h2("Jour 3 : envol vers le sud, jusqu’à Louxor"),
      p("Un court vol intérieur épargne une longue route et vous dépose dans la plus forte concentration de sites antiques au monde. Mettez-vous en jambes par la rive orientale : Karnak, immense et stratifié, et le temple de Louxor, à voir de préférence quand l’après-midi se rafraîchit et que les projecteurs s’allument."),
      h2("Jours 4–6 : le Nil, de Louxor à Assouan"),
      p("Ce sont là le cœur du voyage, le plus souvent à bord d’une croisière. La rive occidentale de Louxor offre la vallée des Rois et le temple en terrasses d’Hatchepsout. En naviguant vers le sud, vous faites halte à Edfou et Kôm Ombo, deux des temples les mieux conservés qui soient, avant d’atteindre Assouan pour Philae et une lente navigation en felouque parmi ses îles. Le rythme temple, fleuve, temple est l’essence même de l’Égypte."),
      h2("Jour 7 : Abou Simbel ou une fin en douceur"),
      p("Les plus mordus peuvent ajouter une échappée à l’aube vers Abou Simbel, les colossaux temples rupestres de Ramsès II sur le lac Nasser — inoubliables, mais au prix d’un départ matinal. L’alternative est une matinée plus douce à Assouan et un retour sans hâte. Dans les deux cas, sept jours forment un tout satisfaisant, non un échantillon expédié."),
      h2("Les arbitrages que nous faisons"),
      p("Nous prenons l’avion entre Le Caire et le Sud plutôt que la route, nous renonçons à greffer un séjour balnéaire en mer Rouge qui dévorerait deux jours, et nous ménageons délibérément des heures lentes — la felouque, un déjeuner tranquille — pour que les temps forts aient de la place pour résonner. Une semaine menée à un rythme humain vaut mieux que dix jours parcourus dans le flou."),
      h2("Envie de plus long ?"),
      p("Avec dix jours ou deux semaines, nous ajoutons Alexandrie, davantage de mer Rouge, ou les oasis du désert Occidental. Mais si vous ne disposez que d’une semaine, cet itinéraire en tire le meilleur parti."),
    ],
  },
  "what-to-pack-for-egypt": {
    author: "L’équipe Ptah Tours",
    publishedISO: "2026-07-22",
    readMinutes: 6,
    body: [
      p("Faire ses bagages pour l’Égypte tient à trois faits : le soleil est fort, les sites et les mosquées demandent un peu de pudeur, et le désert devient étonnamment froid la nuit tombée. Réglez ces points et vous voyagerez léger. Voici la courte liste qui compte vraiment, et ce que les néophytes ont tendance à trop emporter."),
      h2("Les vêtements : légers, amples et superposés"),
      p("Pensez coton et lin respirants, dans des teintes claires, coupés amples pour rester au frais et protéger votre peau du soleil. Les couches comptent plus qu’on ne le croirait : les matins sur l’eau et les soirées du désert peuvent être franchement frais, alors emportez un pull ou une veste légère même en été. L’objet le plus utile que la plupart des gens oublient, c’est une grande écharpe ou un châle — protection solaire, contre la poussière, enveloppe pour les soirées fraîches, et voile pudique pour les mosquées, le tout en un."),
      h2("S’habiller pour les sites et les mosquées"),
      p("L’Égypte est décontractée, mais couvrir épaules et genoux est respectueux dans les temples et attendu dans les mosquées, pour les hommes comme pour les femmes. Les femmes emporteront un foulard pour se couvrir les cheveux à l’entrée d’une mosquée. Nul besoin de s’habiller lourdement — visez simplement le pudique et le respirant plutôt que le dénudé, et vous vous sentirez à l’aise partout."),
      h2("Les chaussures"),
      p("Vous marcherez bien plus que prévu, sur le sable, la pierre inégale et l’occasionnelle rampe pentue d’un tombeau. Une paire de chaussures de marche fermées et déjà faites au pied est la seule chose qui mérite la priorité ; les sandales conviennent aux temps morts mais protègent mal parmi les gravats et sur le sol brûlant."),
      h2("Trousse soleil et santé"),
      p("Un chapeau à large bord, de bonnes lunettes de soleil et une crème solaire à indice élevé, respectueuse des récifs, sont incontournables. Emportez vos médicaments personnels dans leur emballage d’origine, une petite réserve de sels de réhydratation, et une gourde rechargeable — rester hydraté est la meilleure défense contre la chaleur. Le gel hydroalcoolique et quelques mouchoirs méritent aussi leur place."),
      h2("Ce qu’il faut laisser"),
      p("La plupart des gens emportent tout simplement trop — vous réenfilerez volontiers les mêmes couches légères. Laissez chez vous les vêtements lourds « au cas où », et laissez le drone : en faire voler un en Égypte est strictement encadré et peut causer de vrais ennuis sur les sites. Faites vos bagages pour le voyage que vous entreprenez réellement, non pour tous ceux que vous pourriez imaginer."),
    ],
  },
  "beyond-giza-underrated-sites": {
    author: "L’équipe Ptah Tours",
    publishedISO: "2026-07-05",
    readMinutes: 7,
    body: [
      p("Les pyramides de Gizeh méritent leur renommée, et tout premier voyage devrait les inclure. Mais le paysage antique de l’Égypte est bien plus profond que ses trois pierres les plus célèbres, et certains des sites les plus gratifiants sont ceux où l’on ne croise presque personne. Une fois les icônes vues, voici où aller ensuite."),
      h2("Saqqarah et Dahchour"),
      p("À une demi-heure au sud de Gizeh, Saqqarah abrite la pyramide à degrés de Djéser — la plus ancienne grande structure en pierre au monde et, en un sens réel, le lieu où la construction des pyramides a commencé. Un peu plus loin, à Dahchour, se dressent la pyramide rhomboïdale et la pyramide rouge, la première véritable pyramide à faces lisses jamais achevée. Ensemble, elles racontent l’histoire que Gizeh ne fait que conclure, et l’on peut souvent les explorer dans une quasi-solitude."),
      h2("Abydos et Dendérah"),
      p("Ces deux temples récompensent la plus longue route au nord de Louxor. Abydos conserve les exquis reliefs sculptés de Séthi Ier et la célèbre Liste royale, un appel des pharaons remontant jusqu’à la légende. Dendérah, dédiée à la déesse Hathor, garde l’un des plafonds peints les mieux conservés d’Égypte — ses bleus profonds et ses étoiles dorées encore vifs au-dessus de la tête. Peu d’excursions concentrent autant de beauté pour aussi peu de monde."),
      h2("Kôm Ombo et Edfou"),
      p("Vus d’ordinaire depuis une croisière sur le Nil, ces deux-là méritent leur propre mention. Kôm Ombo est un rare temple double, dédié à deux dieux à la fois, avec un mur d’instruments chirurgicaux sculptés qui ne manque jamais d’étonner. Edfou, dédié à Horus, est le grand temple le plus complètement conservé du pays — parcourez-le et vous comprendrez à quoi ressemblaient ces lieux du temps où ils étaient intacts."),
      h2("Le désert Occidental"),
      p("Pour les voyageurs disposant de plus de temps, les oasis du désert Occidental — Bahariya, Dakhla, Kharga — et les surréelles formations de craie sculptées par le vent du désert Blanc offrent une Égypte où il n’y a presque personne d’autre : sources, palmeraies, nuits chaudes du désert sous des ciels immenses. C’est un tout autre voyage, et un voyage inoubliable."),
      h2("Pourquoi aller au-delà des icônes"),
      p("Les sites célèbres vous disent ce que l’Égypte antique a accompli. Les plus discrets vous le font ressentir — seul dans une salle peinte, avec le gardien, votre guide et trois mille ans de silence. C’est l’Égypte dont on tombe amoureux, et elle commence juste au-delà du bord de la carte postale."),
    ],
  },
  "egypt-with-kids-family-guide": {
    author: "L’équipe Ptah Tours",
    publishedISO: "2026-06-18",
    readMinutes: 7,
    body: [
      p("L’Égypte est l’un des grands voyages à faire avec des enfants. L’histoire qu’ils connaissent à moitié, par les dessins animés et les manuels, devient réelle sous leurs yeux — de vraies momies, de vraies pyramides, des chameaux, des bateaux et des trésors — et l’émerveillement est contagieux. Bien le réussir demande un peu d’organisation, et voici ce que nous avons appris."),
      h2("Plus adapté aux enfants qu’on ne le pense"),
      p("Les Égyptiens adorent les enfants, et les familles sont chaleureusement accueillies partout, des marchés animés aux temples paisibles. Les enfants reçoivent souvent plus de patience et plus de sourires que les adultes. Les sites phares du pays se trouvent être précisément ceux qui enflamment les jeunes imaginations : des pyramides à contempler d’en bas, des tombeaux où risquer un œil, un fleuve à parcourir à la voile."),
      h2("Rythme et âges"),
      p("La seule règle qui sauve un voyage en famille, c’est de ralentir. Deux sites par jour suffisent amplement ; un programme précipité met tout le monde à cran. Les enfants en âge scolaire — à partir de six ans environ — en tirent généralement le plus, assez grands pour se souvenir des pyramides et suivre une histoire. Les plus jeunes peuvent tout à fait venir ; ménagez simplement des après-midis à la piscine et des temps de repos, et revoyez vos ambitions de visite à la baisse en conséquence."),
      h2("Vaincre la chaleur"),
      p("La chaleur est le vrai défi, alors composez avec la journée plutôt que contre elle : départs matinaux, longue pause de midi, et beaucoup d’eau. Une croisière sur le Nil est une base familiale idéale — un hôtel flottant, avec piscine, qui vous porte d’un site à l’autre, de sorte que personne ne passe les heures les plus chaudes à arpenter les lieux, et qu’il y a toujours un endroit où se rafraîchir."),
      h2("Nourriture et estomacs"),
      p("Tenez-vous à l’eau en bouteille ou filtrée, y compris pour se brosser les dents, et préférez les adresses fréquentées et fraîchement cuisinées à tout ce qui traîne à l’air. Pain, riz, viandes grillées et fruits frais contentent la plupart des enfants. Emportez des sels de réhydratation à tout hasard, et abordez la cuisine locale progressivement plutôt que de vous y jeter dès le premier soir."),
      h2("Les voyages qui fonctionnent"),
      p("Un voyage privé et guidé paie doublement avec une famille — un bon guide ajuste les récits à l’âge de vos enfants et garde la journée souple. Intégrez ce qui transforme l’histoire en aventure : une balade à dos de chameau aux pyramides, une navigation en felouque, les salles des momies au musée, une calèche à Louxor. Trouvez le bon rythme, et l’Égypte devient le voyage dont vos enfants parleront pendant des années."),
    ],
  },
};
