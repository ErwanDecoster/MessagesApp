<template>
  <div class="flex flex-col pt-12 gap-12 max-w-4xl mx-auto sm:pt-0 sm:grid sm:grid-cols-2 min-h-[calc(100vh-2rem)]">
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
    <div class="col-span-2 md:px-6">
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
    </div>
  </div>
</template>