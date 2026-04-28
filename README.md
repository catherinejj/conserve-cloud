# 🥫 Conserve Cloud

> Votre placard à conserves, mais dans le cloud.

**Conserve Cloud** est une application web qui permet de gérer son stock de conserves alimentaires en ligne. Fini les mauvaises surprises devant un placard à moitié vide : visualisez en un coup d'œil ce qu'il vous reste, ce qui arrive à expiration, et ce qu'il faut racheter.

---

## 👥 Équipe

Ce projet est réalisé dans le cadre d'un TP à **Ynov** par :

- **Angie Pons**
- **Catherine Jules**

---

## 🛠️ Stack technique

| Côté        | Technologie                                          |
| ----------- | ---------------------------------------------------- |
| Front-end   | [Angular](https://angular.dev/)                      |
| Back-end    | [NestJS](https://nestjs.com/)                        |
| Base de données | [PostgreSQL](https://www.postgresql.org/)        |

---

## 📁 Structure du projet

```
conserve-cloud/
├── front/      # Application Angular
├── back/       # API NestJS
└── README.md
```

---

## 🚀 Démarrage rapide

### Prérequis

- [Node.js](https://nodejs.org/) (v22 ou +)
- [Angular CLI](https://angular.dev/tools/cli) : `npm install -g @angular/cli`
- [NestJS CLI](https://docs.nestjs.com/cli/overview) : `npm install -g @nestjs/cli`
- [PostgreSQL](https://www.postgresql.org/download/)

### Lancer le back-end

```bash
cd back
npm install
npm run start:dev
```

L'API tourne par défaut sur **http://localhost:3000**.

### Lancer le front-end

```bash
cd front
npm install
ng serve
```

L'application est accessible sur **http://localhost:4200**.

---

## 🎯 Fonctionnalités prévues

- [ ] Ajouter une conserve à son placard (nom, type, date de péremption, quantité)
- [ ] Visualiser l'ensemble du stock
- [ ] Modifier ou supprimer une conserve
- [ ] Alerte sur les conserves bientôt périmées
- [ ] (Bonus) Liste de courses générée automatiquement

---

## 📚 Contexte

Projet réalisé dans le cadre d'un **TP Ynov**.