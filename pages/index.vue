<template>
  <div class="flex flex-col">
    <div class="bg-blue-500 text-center py-4 px-2">
      <h1 class="text-2xl text-left">Messages App</h1>
    </div>
    <div class="flex h-full bg-blue-500">
      <div class="w-64 h-full p-2 flex flex-col gap-4">
        <h2 class="text-xl">Messages</h2>
        <div class="flex flex-col gap-2">
          <div class="rounded-md bg-blue-400 p-2">
            <h3 class="text-lg">Nouvelle conversation</h3>
          </div>
          <div class="rounded-md bg-blue-200 p-2">
            <h3 class="text-lg">Loise Archer</h3>
            <p class="text-sm text-ellipsis overflow-hidden h-10">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti maiores nemo tenetur odio aliquam. Vero </p>
          </div>
          <div class="rounded-md bg-blue-400 p-2">
            <h3 class="text-lg">Yanis Decoster</h3>
            <p class="text-sm text-ellipsis overflow-hidden h-10">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti maiores nemo tenetur odio aliquam. Vero </p>
          </div>
          <div class="rounded-md bg-blue-400 p-2">
            <h3 class="text-lg">Sarah Decoster</h3>
            <p class="text-sm text-ellipsis overflow-hidden h-10">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti maiores nemo tenetur odio aliquam. Vero </p>
          </div>
        </div>
      </div>
      <div class="p-2 mr-2 mb-2 flex-1 rounded-2xl flex flex-col bg-blue-200 gap-4">
        <div class="rounded-lg bg-blue-300 p-2">
          <h3 class="text-lg text-center">Loise Archer</h3>
        </div>
        <div class="flex-1 flex flex-col-reverse gap-2">
          <div class="flex flex-col items-end">
            <p class="text-sm">10h30</p>
            <p class="bg-blue-100 py-1 px-2 rounded-lg max-w-[60%]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis velit, reiciendis minus officia excepturi laborum repellendus saepe ipsa. Veritatis qui beatae rem modi architecto sed quo perspiciatis? Doloribus</p>
          </div>
          <div class="flex flex-col">
            <p class="text-sm">10h30</p>
            <p class="bg-blue-300 py-1 px-2 rounded-lg max-w-[60%]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis velit, reiciendis minus officia excepturi laborum repellendus saepe ipsa. Veritatis qui beatae rem modi architecto sed quo perspiciatis? Doloribus</p>
          </div>
          <div class="flex flex-col">
            <p class="text-sm">10h30</p>
            <p class="bg-blue-300 py-1 px-2 rounded-lg max-w-[60%]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facilis velit, reiciendis minus officia excepturi laborum repellendus saepe ipsa. Veritatis qui beatae rem modi architecto sed quo perspiciatis? Doloribus</p>
          </div>
        </div>
        <div class="rounded-lg bg-blue-300 p-2 flex gap-2">
          <div class="grow">
            <label for="new-message">Nouveau message</label>
            <input type="tel" name="" id="">
          </div>
          <input class="w-fit" type="submit" value="Envoyer">
        </div>
      </div>
    </div>
  </div>
</template>