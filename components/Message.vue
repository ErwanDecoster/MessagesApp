<template>
  <div
    class="flex-none flex flex-col"
    :class="{ 'items-end': message.send_user_id == user.id }"
    @click="active = !active"
  >
    <p v-if="active" class="text-sm text-white">
      {{ formatDate(message.created_at) }}
    </p>
    <p 
      class="py-1 px-2 rounded-lg break-words w-fit max-w-sm"
      :class="{ 'bg-[#E7D7C1]': message.send_user_id == user.id, 'bg-white': message.send_user_id != user.id}"
    >
      {{ message.content }}
    </p>
    <p v-if="message.seen_at && active" class="text-sm text-white">
      Lu à {{ formatDate(message.seen_at) }}
    </p>
  </div>
</template>

<script>
export default {
  props: ['message', 'user'],
  data() {
    return {
      active: false,
    }
  },
  methods: {
    async UpdateMessageSeen() {
      const actualTime = ((new Date()).toISOString()).toLocaleString('zh-TW')
      try {
    		const supabase = useSupabaseClient();
        const { error } = await supabase
          .from('messages')
          .update({ seen_at: actualTime })
          .eq('id', this.message.id)
        if (error) throw error
        this.message.seen_at = actualTime;
    	} catch (error) {
        console.log(error);
    		// this.form.formMessages.push({type: 'error', content: error })
    	}
    }
  },
  mounted() {
    console.log(this.message);
    // Update if message not sended by actual user 
    if (this.message.send_user_id != this.user.id)
      if (!this.message.seen_at)
        this.UpdateMessageSeen()
    // if (!this.message.seen_at)
  },
}
</script>