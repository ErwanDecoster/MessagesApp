/* __placeholder__ */
export default (await import('vue')).defineComponent({
data() {
return {
newConversationModal: false,
alertMessages: [],
conversations: [],
form: {
message: '',
},
user: {},
};
},
methods: {
DisableOtherConversations(activeConversation) {
this.conversations.forEach((conversation) => {
conversation.active = false;
});
activeConversation.active = true;
},
UpdateConversationMessage(eventType, newMessage, oldMessage) {
if (eventType == 'INSERT') {
const conversation_pos = this.conversations.findIndex(conversation => conversation.id == newMessage.conversation_id);
const actualConversation = this.conversations[conversation_pos];
if (actualConversation.messages.length == 0)
actualConversation.messages.push(newMessage);
else if (actualConversation.messages[actualConversation.messages.length - 1].id != newMessage.id) {
actualConversation.messages.push(newMessage);
}
}
else if (eventType == 'DELETE') {
let conversation_pos = 0;
let message_pos;
while (conversation_pos < this.conversations.length) {
const element = this.conversations[conversation_pos];
message_pos = element.messages.findIndex(message => message.id == oldMessage.id);
if (message_pos >= 0)
break;
conversation_pos++;
}
this.conversations[conversation_pos].messages.splice(message_pos, 1);
}
else if (eventType == 'UPDATE') {
const conversation_pos = this.conversations.findIndex(conversation => conversation.id == newMessage.conversation_id);
const actualConversation = this.conversations[conversation_pos];
const message_pos = actualConversation.messages.findIndex(message => message.id == newMessage.id);

actualConversation.messages[message_pos] = newMessage;
}
},
MessageUpdate() {
const supabase = useSupabaseClient();
const message = supabase.channel('messages-all-channel')
.on(
'postgres_changes',
{ event: '*', schema: 'public', table: 'messages' },
(payload) => {
this.UpdateConversationMessage(payload.eventType, payload.new, payload.old);
}
)
.subscribe();
},
UpdateConversation(eventType, newConversation, oldConversation) {
const user = useSupabaseUser();

if (eventType == 'INSERT') {
this.FetchConversations(newConversation.id).then((conversation) => {
this.conversations.push(conversation[0]);
});
}
else if (eventType == 'DELETE') {
const conversation_pos = this.conversations.findIndex(conversation => conversation.id == oldConversation.id);
this.conversations.splice(this.conversations[conversation_pos], 1);
}
// WARNING should delete messages and parcipant
// else if (eventType == 'UPDATE') {
//   conversation_pos = this.conversations.findIndex(conversation => conversation.id == oldConversation.id)
//   this.conversations[conversation_pos] = newConversation;
// }
},
ConversationUpdate() {
const supabase = useSupabaseClient();
const conversation = supabase.channel('conversation-all-channel')
.on(
'postgres_changes',
{ event: '*', schema: 'public', table: 'conversations' },
(payload) => {
this.UpdateConversation(payload.eventType, payload.new, payload.old);
}
)
.subscribe();
},
UpdateConversationParticipant(eventType, newParticipant, oldParticipant) {
if (eventType == 'INSERT') {
const conversation_pos = this.conversations.findIndex(conversation => conversation.id == newParticipant.conversation_id);
const actualConversation = this.conversations[conversation_pos];

actualConversation.participants.push(newParticipant);
}
},
ParticipantUpdate() {
const supabase = useSupabaseClient();
const participant = supabase.channel('participants-all-channel')
.on(
'postgres_changes',
{ event: '*', schema: 'public', table: 'participants' },
(payload) => {
this.UpdateConversationParticipant(payload.eventType, payload.new, payload.old);
}
)
.subscribe();
},
async FetchConversations(id) {
if (id) {
try {
const supabase = useSupabaseClient();
const user = useSupabaseUser();
let { data: conversation, error } = await supabase
.from('conversations')
.select(`
            *,
            participants (
              *
            ),
            messages (
              *
            )
          `)
.eq('id', id)
.neq('participants.user_id', user.value.id);
if (error) throw error;
return (conversation);
} catch (error) {
this.alertMessages.push({ type: 'error', content: error });
}
} else {
try {
const supabase = useSupabaseClient();
const user = useSupabaseUser();
let { data: conversations, error } = await supabase
.from('conversations')
.select(`
            *,
            participants (
              *
            ),
            messages (
              *
            )
          `)
// .eq('participants.user_id', user.value.id)
.neq('participants.user_id', user.value.id)
.order('id', { foreignTable: 'messages', ascending: true });
if (error) throw error;
return (conversations);
} catch (error) {
this.alertMessages.push({ type: 'error', content: error });
}
}
},
async FetchUserData(id) {
try {
const supabase = useSupabaseClient();
let { data: data_user, error } = await supabase
.from('user_data')
.select(`*`)
.eq('user_id', id);
if (error) throw error;
return (data_user);
} catch (error) {
this.alertMessages.push({ type: 'error', content: error });
}
},
NewMessages(conversation, content) {
if (content.length) {
const user = useSupabaseUser();
this.PostMessages(user.value.id, conversation.id, content).then((value) => {
conversation.messages.push(value[0]);
this.form.message = '';
});
}
},
async PostMessages(user_id, conversation_id, content) {
try {
const supabase = useSupabaseClient();
let { data, error } = await supabase
.from('messages')
.insert([
{
send_user_id: user_id,
conversation_id: conversation_id,
content: content,
},
])
.select();
if (error) throw error;
return (data);
} catch (error) {
this.alertMessages.push({ type: 'error', content: error });
}
},
async SignOut() {
try {
const supabase = useSupabaseClient();
let { error } = await supabase.auth.signOut();
if (error) throw error;
} catch (error) {
this.alertMessages.push({ type: 'error', content: error });
}
},
CreateMessagesTimeline(messages) {
let i = 0;
let timeline = [];
const dif = 1;

let actualDayTimestamp = new Date();
actualDayTimestamp.setHours(0, 0, 0, 0);
actualDayTimestamp = actualDayTimestamp.getTime();

let yesterdayTimestamp = new Date();
yesterdayTimestamp.setHours(0, 0, 0, 0);
yesterdayTimestamp.setDate(new Date().getDate() - 1);
yesterdayTimestamp = yesterdayTimestamp.getTime();

console.log(messages);


while (i < messages.length - 1) {
console.log(i);
let messageDate = new Date(messages[i].created_at);
let messageTimestamp = messageDate.getTime();

console.log('actualDayTimestamp:', actualDayTimestamp);
console.log('yesterdayTimestamp:', yesterdayTimestamp);
console.log('messageTimestamp:', messageTimestamp);
console.log('messageDate:', messageDate);

if (timeline.length > 0) {
const previousMessageDate = new Date(timeline[i - 1].date);

let actualMessageWithoutDif = messageDate;
const actualMessageHoursWithoutDif = messageDate.getHours() - dif;
if (actualMessageHoursWithoutDif >= 0)
actualMessageWithoutDif.setHours(actualMessageHoursWithoutDif);
console.log('actualMessageWithoutDif:', actualMessageWithoutDif);
console.log('previousMessageDate', previousMessageDate);
if (previousMessageDate < actualMessageWithoutDif) {
if (actualDayTimestamp < messageTimestamp)
timeline.push({ timeString: timeToString(messageDate), date: messageDate });
else if (yesterdayTimestamp < messageTimestamp)
timeline.push({ timeString: formatDate(messageDate), date: messageDate });
}
}
else {
console.log('in else');
if (actualDayTimestamp < messageTimestamp)
timeline.push({ timeString: timeToString(messageDate), date: messageDate });

else
timeline.push({ timeString: formatDate(messageDate), date: messageDate });
}
messages[i].date = messageTimestamp;
timeline.push(messages[i]);
console.log(timeline);
console.log(timeline.length);
i++;
}
return (timeline);
}
},
mounted() {
const user = useSupabaseUser();
this.user = user;
this.MessageUpdate();
this.ConversationUpdate();
this.ParticipantUpdate();
this.FetchConversations().then((conversations) => {
conversations.forEach((conversation) => {
console.log(conversation);
conversation.messages = this.CreateMessagesTimeline(conversation.messages);
console.log(conversation);
});
this.conversations = conversations;
// console.log(conversations);
});
// watchEffect(() => {
//   if (!user.value)
//     navigateTo('/');
// })
},
});
