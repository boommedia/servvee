// Run with: npx tsx src/emails/render-supabase-templates.ts
// Copy the output into Supabase dashboard → Authentication → Email Templates
import { confirmationEmail } from './confirmation'
import { passwordResetEmail } from './password-reset'

console.log('\n===== CONFIRMATION EMAIL =====\n')
console.log(confirmationEmail())
console.log('\n===== PASSWORD RESET EMAIL =====\n')
console.log(passwordResetEmail())
