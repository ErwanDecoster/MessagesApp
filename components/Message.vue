<template>
  <div
    class="flex-none flex flex-col"
    :class="{ 'items-end': message.send_user_id == user.id }"
    @click="active = !active"
  >
    <p v-if="active" class="text-sm text-slate-600">
      {{ formatDate(message.created_at) }}
    </p>
    <p 
      class="py-1 blur-sm px-2 rounded-lg break-words w-fit max-w-sm"
      :class="{ 'bg-[#0a9396]': message.send_user_id == user.id, 'bg-slate-200': message.send_user_id != user.id}"
    >
      {{ message.content }}
    </p>
    <p v-if="message.seen_at && active" class="text-sm text-slate-600">
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
    if (this.message.send_user_id != this.user.id)
      if (!this.message.seen_at)
        this.UpdateMessageSeen()
  },
}
</script>