

// async SignUp() {
// 	try {
// 		const supabase = useSupabaseClient();
// 		let { data, error } = await supabase.auth.signUp({
// 			email: this.form.email,
// 			password: this.form.password
// 		})
// 		if (error) throw error
// 	} catch (error) {
// 		this.formMessages.push({type: 'error', content: error })
// 	}
// }, 