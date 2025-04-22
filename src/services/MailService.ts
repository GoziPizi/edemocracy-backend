import { MembershipStatus } from '@prisma/client';
import nodemailer from 'nodemailer';

const emailAdress = process.env.EMAIL_ADRESS;
const emailPassCode = process.env.EMAIL_PASS_CODE;

const transporter = nodemailer.createTransport({
  host: 'ssl0.ovh.net',
  port: 465,
  secure: true,
  auth: {
    user: emailAdress,
    pass: emailPassCode,
  },
});

export function sendEmail(email: string, subject: string, text: string) {
  const mailOptions = {
    from: emailAdress,
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

export function sendReinitPasswordMail(email: string, token: string) {
  const subject = 'Réinitialisation de votre mot de passe';
  const text = `Bonjour, veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : https://digital-democracy.com/change-password/?token=${token}&email=${email}`;
  sendEmail(email, subject, text);
}

export function sendThankDonationMail(email: string, amount: number) {
  const subject = 'Un grand merci pour votre soutien !';
  const text = `Chère donatrice, cher donateur, 

Au nom de toute l’équipe de Democracy Online et de l’association Virtual Democracy Initiative, je tiens à vous adresser nos plus sincères remerciements pour votre généreux don. 

🙏 Grâce à des personnes engagées comme vous, nous pouvons continuer à faire vivre et évoluer une plateforme indépendante, dédiée à la participation citoyenne et à une démocratie réellement partagée. 

🎯 Votre contribution est précieuse. Elle nous permet de : 

    Financer les projets en cours de développement, 

    Améliorer l’expérience utilisateur, 

    Maintenir un espace de débat transparent, structuré et respectueux, où chaque voix peut compter. 

Ce geste témoigne de votre confiance, mais aussi de votre volonté d’agir pour une société plus équitable, plus participative et plus humaine. 

Encore une fois, merci pour votre soutien, votre engagement et votre vision citoyenne. 

Restons connectés, et continuons à faire bouger les lignes ensemble. 

Avec toute ma gratitude, 
L’équipe Democracy Online `;
  sendEmail(email, subject, text);
}

//Moderation related emails

export function sendWarnMail(email: string, reason: string) {
  const subject = 'Avertissement';
  const text = `Bonjour, vous avez reçu un avertissement pour la raison suivante : ${reason}`;
  sendEmail(email, subject, text);
}

//Notifications related emails

export function sendFollowUpdateMail(email: string, entityName: string) {
  const subject = "Mise à jour d'un sujet suivi";
  const text = `Bonjour, un sujet que vous suivez (${entityName}) a été mis à jour`;
  sendEmail(email, subject, text);
}

export function sendNewPayingMemberMail(
  newMemberEmail: string,
  status: MembershipStatus
) {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const subject = 'Nouveau membre payant';
  const text = `Bonjour, un nouveau membre payant a été ajouté : ${newMemberEmail} avec le statut ${status}`;
  sendEmail(adminEmail, subject, text);
}

export function sendNewBienfaiteurMail(newBienfaiteurEmail: string) {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const subject = 'Nouveau bienfaiteur';
  const text = `Bonjour, un nouveau bienfaiteur a été ajouté : ${newBienfaiteurEmail}`;
  sendEmail(adminEmail, subject, text);
}

//Send thank you email to the new member

export function sendThankToNewFreeMember(
  newMemberEmail: string,
  firstName: string
) {
  const subject = 'Bienvenue sur Democracy Online – Votre voix commence ici';
  const text = `Bonjour ${firstName}, 

Merci pour ton inscription gratuite sur democracy-online.com ! 

Tu peux déjà explorer les débats publics, consulter les arguments, voter et suivre les idées citoyennes. 
Le vote pondéré et la création d’arguments sont réservés aux comptes payants. 

🚧 Le site est encore en phase Bêta. 
Merci de signaler tout bug ou dysfonctionnement à support@democracy-online.com. 
🙏 Nous avons aussi besoin d’aide : que ce soit un coup de main technique, un mécénat, ou un prêt participatif, contacte-nous à help@democracy-online.com. 
💼 Tu veux nous rejoindre ou proposer tes compétences ? Écris-nous à job@democracy-online.com. 

🎁 Parrainage : 
Génère ton code personnel dans les paramètres. 
Et si tu es connecté, chaque lien partagé (débat, page, etc.) contient déjà ton code. 
➡️ Si quelqu’un s’inscrit en suivant ce lien, tu gagnes 1 € ! 

📩 Questions sur la plateforme : vdi@democracy-online.com 
📩 Questions sur la ligne politique ou les représentants : mca@democracy-online.com 

Merci pour ta curiosité citoyenne, 
L’équipe Democracy Online `;
  sendEmail(newMemberEmail, subject, text);
}

export function sendThankToNewStandardMember(
  newMemberEmail: string,
  firstName: string
) {
  const subject =
    'Merci pour votre inscription – Accès étendu et vote pondéré activés';
  const text = `Bonjour ${firstName}, 

Merci pour ton inscription Standard (4,99 €) ! 
Tu bénéficies désormais de fonctionnalités avancées sur democracy-online.com : 

✅ Création d’arguments 
✅ Participation complète aux débats 
✅ Vote pondéré activé 

❗ Ce compte ne donne pas droit à l’adhésion VDI ni au statut politique du MCA. 

🚧 Le site est toujours en phase Bêta. 
Merci de signaler tout bug à support@democracy-online.com. 
🙏 Tu peux aussi nous aider autrement : via un mécénat, un prêt participatif ou une collaboration. Contacte-nous à help@democracy-online.com. 
💼 Pour proposer tes compétences : job@democracy-online.com 

🎁 Système de parrainage : 
Tu peux générer ton code dans les paramètres. Si tu es connecté, le code est automatiquement intégré à tous les liens (débat, page, etc.). 
➡️ Chaque inscription payante via ce lien te rapporte 1 €. 

📩 Questions fonctionnelles : vdi@democracy-online.com 
📩 Pour le volet politique (MCA) : mca@democracy-online.com 

Merci pour ton engagement, 
L’équipe Democracy Online `;
  sendEmail(newMemberEmail, subject, text);
}

export function sendThankToNewPremiumMember(
  newMemberEmail: string,
  firstName: string
) {
  const subject = 'Bienvenue – Votre voix compte dans le mouvement citoyen';
  const text = `Bonjour ${firstName}, 

Merci pour ton inscription Premium (14,99 €) ! 
Tu es désormais membre du Mouvement des Citoyens Actif (MCA) et tes idées peuvent être représentées au Parlement ou au Sénat à travers des candidats engagés pour une vraie démocratie participative. 

🎯 Ton compte te donne accès à : ✅ Création de débats et d’arguments 
✅ Vote pondéré activé 
✅ Gestion de pages de groupe (parti, entreprise, association) 
✅ Suivi actif de tes idées citoyennes 

🚧 Le site est en phase Bêta. 
Merci de signaler tout bug à support@democracy-online.com. 
🙏 Tu peux aussi nous soutenir par un prêt, un mécénat, ou une collaboration : écris à help@democracy-online.com. 
💼 Pour travailler ou proposer ton expertise : job@democracy-online.com 

🎁 Parrainage : 
Génère ton code personnel dans les paramètres. 
Si tu es connecté, le code est intégré automatiquement dans chaque lien partagé ! 
➡️ Chaque inscription payante via ce lien te rapporte 1 €. 

📩 Questions sur le site : vdi@democracy-online.com 
📩 Pour toute question politique : mca@democracy-online.com 

Merci pour ta confiance, 
L’équipe Democracy Online `;
  sendEmail(newMemberEmail, subject, text);
}

export function sendThankToNewBienfaiteurMember(
  newMemberEmail: string,
  firstName: string
) {
  const subject = 'Merci pour votre soutien exceptionnel – Membre MCA + VDI';
  const text = `Bonjour ${firstName}, 

Merci pour ton inscription en tant que Bienfaiteur (29,99 €). 
Tu es maintenant membre du MCA et adhérent de l’association VDI, ce qui te donne un rôle actif à la fois politique et associatif. 

🎁 Tu bénéficies de : ✅ Toutes les fonctionnalités du site 
✅ Vote pondéré activé 
✅ Participation aux décisions stratégiques via VDI 
✅ Accès prioritaire aux débats sur l’évolution du site 
✅ Mention (facultative) dans notre espace bienfaiteurs 

🚧 Le site est en phase Bêta. 
Merci de signaler les bugs à support@democracy-online.com. 
🙏 Tu peux également nous aider à aller plus loin par un mécénat, un prêt participatif, ou un appui technique. Contacte-nous à help@democracy-online.com. 
💼 Tu souhaites t’impliquer ou rejoindre l’équipe ? Écris-nous à job@democracy-online.com 

🎁 Parrainage : 
Depuis les paramètres, génère ton code personnel. 
Ensuite, partage simplement un lien vers un débat ou une page : si tu es connecté, ton code est automatiquement inclus ! 
➡️ Chaque inscription payante via ce lien te rapporte 1 €. 

📩 Contact VDI : vdi@democracy-online.com 
📩 Contact politique MCA : mca@democracy-online.com 

Avec le lancement du site, je suis actuellement très sollicité et un peu débordé, mais je reviendrai vers vous très prochainement au sujet de la modération si cela vous intéresse toujours. 

Merci infiniment pour ton soutien actif, 
L’équipe Democracy Online `;
  sendEmail(newMemberEmail, subject, text);
}
