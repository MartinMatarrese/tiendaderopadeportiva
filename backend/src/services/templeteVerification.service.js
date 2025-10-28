export const templeteVerificationEmail = (user, verificationToken) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;         border-radius: 10px;">
            <div style="text-align: center; background-color: #007bff; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0;">¡Bienvenido a Tienda Deportiva!</h1>
            </div>
      
            <div style="padding: 20px;">
                <h2 style="color: #333;">Hola ${user.first_name} ${user.last_name},</h2>
                <p>Gracias por registrarte en nuestra tienda. Para activar tu cuenta, por favor verifica tu email haciendo clic en el siguiente botón:</p>
        
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                        style="background-color: #007bff; color: white; padding: 15px 30px; 
                            text-decoration: none; border-radius: 5px; font-size: 16px; 
                            font-weight: bold; display: inline-block;">
                        ✅ Verificar Mi Cuenta
                    </a>
                </div>
        
                <p>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; 
                        border-left: 4px solid #007bff; word-break: break-all; 
                        font-size: 14px; color: #495057;">
                    ${verificationUrl}
                </div>
        
                <p style="margin-top: 20px; color: #6c757d; font-size: 14px;">
                    <strong>⚠️ Importante:</strong> Este enlace expirará en 24 horas.
                </p>
        
                <p style="margin-top: 30px; color: #6c757d;">
                    Si no te registraste en nuestra tienda, por favor ignora este email.
                </p>
            </div>
      
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center; 
                      border-radius: 0 0 10px 10px; color: #6c757d; font-size: 12px;">
                <p>© 2024 Tienda Deportiva. Todos los derechos reservados.</p>
            </div>
        </div
    `;
};