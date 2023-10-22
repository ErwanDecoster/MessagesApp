<template>
  <div class="flex flex-col my-24 gap-12 max-w-4xl mx-auto sm:pt-0 sm:grid sm:grid-cols-2 min-h-[calc(100vh-2rem)]">
    <div class="md:px-6 flex flex-col justify-center items-center">
      <p class="text-2xl text-left text-[#E7D7C1] font-bold">Messages App</p>
    </div>
    <div class="md:px-6 flex flex-col justify-center items-center">
      <div class="bg-[#E7D7C1] rounded-3xl p-4 grid gap-2 max-w-sm w-full">
        <!-- <h1 class="text-xl text-left">Connection</h1> -->
        <NuxtLink to="/login" class="btn-secondary" >J'ai deja un compte</NuxtLink>
        <NuxtLink to="/register" class="btn-primary" >Crée un compte</NuxtLink>
      </div>
    </div>
    <div class="col-span-2 grid gap-12 md:px-6">
      <div class="bg-[#E7D7C1] rounded-3xl p-4 grid gap-2 mx-auto">
        <h2 class="text-xl">Qu'es ce que Messages App ?</h2>
        <p>MessagesApp est une application de messagerie basique conçue pour simplifier la communication entre les utilisateurs.</p>
        <div>
          <h3 class="text-lg">Envoyer des Messages Instantanés</h3>
          <p>Échangez des messages texte en temps réel avec vos amis, votre famille ou vos collègues.</p>
        </div>
        <div>
          <h3 class="text-lg">Restez en Contact Facilement</h3>
          <p>Restez en contact avec vos proches pour discuter de sujets quotidiens ou partager des informations importantes.</p>
        </div>
        <div>
          <h3 class="text-lg">Interface Simple et Efficace</h3>
          <p>Pas de fonctionnalités compliquées ni de distractions inutiles, juste une messagerie directe pour une communication facile et rapide.</p>
        </div>
        <p>
          Avec MessagesApp, la messagerie instantanée n'a jamais été aussi simple et directe. Essayez-la dès aujourd'hui pour une communication fluide et efficace.
          <NuxtLink to="/register" class="btn-secondary inline-block w-fit" >Crée un compte</NuxtLink>
        </p>
      </div>
      <div class="bg-[#E7D7C1] rounded-3xl p-4 grid gap-2 mx-auto">
        <h2 class="text-xl">Fonctionnalités à venir 🚀</h2>
        <p>Messages App est en cours de développement. Des bugs ou comportements étranges peuvent survenir. Si cela vous arrive, merci de me les signaler à : <a class="text-blue-600" href="mailto:contact@erwan-decoster.com">contact@erwan-decoster.com</a></p>
        <ul class="list-disc list-inside">
          <li>🚧Correction de bugs sur la timeline des messages.</li>
          <li>🚧Amélioration de la responsabilité (le site sera plus facilement utilisable sur mobile).</li>
          <li>⚡Ajout des paramètres de compte.</li>
          <ol class="ml-4 list-disc list-inside">
            <li>⚡Possibilité de ne pas référencer son compte. Il sera impossible pour d'autres utilisateurs de vous trouver avec votre numéro de téléphone.</li>
            <li>⚡Possibilité de choisir entre plus de thèmes.</li>
            <li>Possibilité de désactiver les notifications.</li>
          </ol>
          <li>Possibilité d'installer le site sur votre écran d'accueil.</li>
          <li>Ajout d'un système de notification.</li>
          <li>Possibilité d'activer ou non les notifications d'une conversation.</li>
          <li>Ajout de la prise en charge des images.</li>
          <li>Ajout de réponses attachées à un message.</li>
          <li>Choix entre plusieurs thèmes pour chaque conversation.</li>
        </ul>
      </div>
    </div>
  </div>
</template>