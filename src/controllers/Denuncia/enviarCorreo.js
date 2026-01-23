const nodemailer = require("nodemailer");

const {
  EMAIL_TOWERANDTOWER,
  PASS_TOWERANDTOWER,
  SMTP_TOWERANDTOWER,
  SMTP_PORT,
  FRONTEND_URL
} = process.env;

// Sanitización básica para evitar inyección HTML
const safe = (value) =>
  String(value ?? "").replace(/[<>]/g, "");

const enviarCorreo = async (correoDestino, denuncia, usuario, tipoCorreo) => {
  const añoActual = new Date().getFullYear();
  if (tipoCorreo === "ADMIN" && !correoDestino) {
    throw new Error("Correo de administrador no definido");
  }

  if (tipoCorreo === "DENUNCIANTE" && !correoDestino) {
    return; // No envía, pero tampoco falla
  }

  const { codigoDenuncia, categoriaDenuncia, pais, estado, anonimo, denunciante, sede, area, involucrados, lugarHechos, descripcionHechos, fechaHechos, archivo } = denuncia
  const {
    nombres = "",
    apellidos = "",
    cargo = "",
    telefono = "",
    correo = "",
  } = usuario || {};
  const tipo = tipoCorreo


  let mensaje_enviar = "";

  if (tipo === "DENUNCIANTE") {
    mensaje_enviar = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:40px 10px;">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="
          background-color:#f9f9f9;
          border-radius:16px;
          border:1px solid #dddddd;
          box-shadow:0 4px 12px rgba(0,0,0,0.1);
          border-collapse:separate;
        ">

          <!-- ICONO -->
          <tr>
            <td align="center" style="padding:30px 20px 10px;">
              <img src="cid:escudoCheck" width="80" alt="Confirmación"
                style="display:block;" />
            </td>
          </tr>

          <!-- TÍTULO -->
          <tr>
            <td align="center" style="padding:10px 20px;">
              <h1 style="margin:0;font-size:28px;color:#00a600;">
                DENUNCIA ENTREGADA
              </h1>
            </td>
          </tr>

          <!-- CONTENIDO -->
          <tr>
            <td style="padding:20px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="
                background-color:#ffffff;
                border-radius:14px;
                border:1px solid #eeeeee;
                border-collapse:separate;
              ">
                <tr>
                  <td style="padding:30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">

                      <tr>
                        <td colspan="2" style="
                          padding-bottom:20px;
                          font-size:18px;
                          font-weight:bold;
                          color:#155e75;
                          border-bottom:2px solid #155e75;
                        ">
                          Detalles Principales
                        </td>
                      </tr>

                      <tr>
                        <td width="40%" style="
                          padding:15px 0;
                          border-bottom:1px solid #f0f0f0;
                          font-size:14px;
                          font-weight:bold;
                          color:#666666;
                        ">
                          Denunciante:
                        </td>
                        <td width="60%" style="
                          padding:15px 0;
                          border-bottom:1px solid #f0f0f0;
                          font-size:14px;
                          color:#333333;
                        ">
                          ${anonimo ? "ANÓNIMO" : safe(nombres + " " + apellidos)}
                        </td>
                      </tr>

                      <tr>
                        <td style="
                          padding:15px 0;
                          border-bottom:1px solid #f0f0f0;
                          font-size:14px;
                          font-weight:bold;
                          color:#666666;
                        ">
                          Categoría:
                        </td>
                        <td style="
                          padding:15px 0;
                          border-bottom:1px solid #f0f0f0;
                          font-size:14px;
                          color:#333333;
                        ">
                          ${safe(categoriaDenuncia)}
                        </td>
                      </tr>

                      <tr>
                        <td style="
                          padding:15px 0;
                          font-size:14px;
                          font-weight:bold;
                          color:#666666;
                        ">
                          Relación con la compañía:
                        </td>
                        <td style="
                          padding:15px 0;
                          font-size:14px;
                          color:#333333;
                        ">
                          ${safe(denunciante?.relacionCompania)}
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="
              padding:20px;
              font-size:12px;
              color:#888888;
              background-color:#f2f2f2;
              border-radius:0 0 16px 16px;
            ">
              Canal de Denuncias Seguro<br />
              © ${añoActual} Tower and Tower. Todos los derechos reservados.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
  }
  if (tipo === "ADMIN") {
    mensaje_enviar = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:40px 10px;">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="
          background-color:#f9f9f9; 
          border-radius:16px; 
          border: 1px solid #dddddd; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-collapse: separate;
        ">
          
           <tr>
            <td align="center" style="padding:30px 20px 10px;">
              <img src="cid:escudoAdvertencia" width="80" alt="Seguridad"
                style="display:block;" />
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:10px 20px;">
              <h1 style="margin:0;font-size:28px;color:#d40005;">
                DENUNCIA RECIBIDA - ${codigoDenuncia}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="
                background-color:#ffffff; 
                border-radius:14px; 
                border: 1px solid #eeeeee;
                border-collapse: separate;
              ">
                <tr>
                  <td style="padding: 30px;"> <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td colspan="2" style="padding-bottom:15px; font-size:18px; font-weight:bold; color:#155e75; border-bottom: 2px solid #155e75;">
                          Detalles de la denuncia
                        </td>
                      </tr>

                      <tr>
                        <td width="40%" style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Denunciante:</td>
                        <td width="60%" style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${anonimo ? "ANÓNIMO" : safe(nombres + " " + apellidos)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Relación con la compañía:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${safe(denunciante?.relacionCompania)}</td>
                      </tr>
                      {${anonimo ? '' : `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Cargo:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${safe(cargo)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Teléfono:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${safe(telefono)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Correo:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${safe(correo)}</td>
                      </tr>
                      `}
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Categoría:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${safe(categoriaDenuncia)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Involucrados:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${safe(involucrados)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Lugar:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${safe(lugarHechos)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Fecha de los hechos:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${safe(fechaHechos)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Descripción:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333; line-height: 1.5;">${safe(descripcionHechos)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Sede:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${safe(sede)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Área:</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${safe(area)}</td>
                      </tr>

                      <tr>
						  <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">
						  	Archivo
						  </td>
                        <td style="padding: 20px 0 0;" colspan="2">
                          ${archivo?.url ? `
                            <a href="${archivo?.url}" style="display:inline-block; padding:12px 25px; background-color:#203a53; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:bold; font-size:14px;">
                              Ver archivo adjunto
                            </a>` : '<span style="color:#999; font-size:13px; font-style:italic;">No hay archivo adjunto</span>'}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px; font-size:12px; color:#888888; background-color: #f2f2f2; border-radius: 0 0 16px 16px;">
              Canal de Denuncias Seguro<br />
              © ${añoActual} Tower and Tower. Todos los derechos reservados.
            </td>
          </tr>

        </table>
        </td>
    </tr>
  </table>

</body>
</html>
  `;
  }

  if (!EMAIL_TOWERANDTOWER || !PASS_TOWERANDTOWER || !SMTP_TOWERANDTOWER) {
    throw new Error("Configuración SMTP incompleta");
  }

  const PORT = Number(SMTP_PORT || 465);

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_TOWERANDTOWER,
      port: PORT,
      secure: true,
      auth: {
        user: EMAIL_TOWERANDTOWER,
        pass: PASS_TOWERANDTOWER,
      },
      connectionTimeout: 5000,
      sendTimeout: 10000,
    });

    const imagenEnviar = tipo === "ADMIN" ? "ESCUDO_ADVERTENCIA.png" : "ESCUDO_CHECK.png";
    const nombreEscudo = tipo === "ADMIN" ? "escudoAdvertencia" : "escudoCheck";
    const mailOptions = {
      from: `Línea Ética - Tower and Tower <${EMAIL_TOWERANDTOWER}>`,
      to: correoDestino,
      subject: `Denuncia recibida - Código ${safe(codigoDenuncia)} `,
      text: `Denuncia recibida correctamente.`.trim(),
      html: mensaje_enviar,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
      },
      attachments: [
        {
          filename: imagenEnviar,
          path: `${FRONTEND_URL}/${imagenEnviar}`,
          cid: nombreEscudo
        }
      ]
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error(error || "No se pudo enviar el correo");
  }
};

module.exports = enviarCorreo;
