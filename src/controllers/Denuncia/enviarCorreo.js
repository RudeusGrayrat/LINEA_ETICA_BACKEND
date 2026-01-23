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
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
  <tr>
    <td align="center" style="padding:40px 0;">

      <!-- CONTENEDOR PRINCIPAL -->
      <table width="600" cellpadding="0" cellspacing="0"
        style="background:#f2f2f2;border-radius:16px;box-shadow:0 4px 10px rgba(0,0,0,0.15);">

        <!-- ICONO -->
        <tr>
          <td align="center" style="padding:30px 20px 10px;">
            <img src="cid:escudoCheck" width="80" alt="Seguridad" style="display:block;" />
          </td>
        </tr>

        <!-- TITULO -->
        <tr>
          <td align="center" style="padding:10px 20px;">
            <h1 style="margin:0;font-size:28px;color:#333;">
              DENUNCIA ENTREGADA
            </h1>
          </td>
        </tr>

        <!-- TARJETA BLANCA -->
        <tr>
          <td style="padding:20px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:14px;padding:25px;">

              <!-- HEADER -->
              <tr>
                <th colspan="2"
                  style="
                    padding-bottom:16px;
                    font-size:18px;
                    font-weight:600;
                    color:#155e75;
                    text-align:left;
                  ">
                  Detalles Principales
                </th>
              </tr>

              <!-- ROWS -->
              <tr>
                <td style="padding:8px 0;font-weight:500;color:#333;">
                  Denunciante:
                </td>
                <td style="padding:8px 0;color:#333;">
                  ${anonimo ? "ANÓNIMO" : safe(nombres + " " + apellidos)}
                </td>
              </tr>

              <tr>
                <td style="padding:8px 0;font-weight:500;color:#333;">
                  Categoría:
                </td>
                <td style="padding:8px 0;color:#333;">
                  ${safe(categoriaDenuncia)}
                </td>
              </tr>

              <tr>
                <td style="padding:8px 0;font-weight:500;color:#333;">
                  Relación con la compañía:
                </td>
                <td style="padding:8px 0;color:#333;">
                  ${safe(denunciante?.relacionCompania)}
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td align="center"
            style="
              background:#ffffff;
              border-radius:0 0 16px 16px;
              padding:18px;
              font-size:12px;
              color:#666;
              line-height:1.4;
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
    if (anonimo) {
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
                        <td colspan="2" style="padding-bottom:20px; font-size:18px; font-weight:bold; color:#155e75; border-bottom: 2px solid #155e75;">
                          Detalles de la denuncia
                        </td>
                      </tr>

                      <tr>
                        <td width="40%" style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Denunciante:</td>
                        <td width="60%" style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${anonimo ? "ANÓNIMO" : safe(nombres + " " + apellidos)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Categoría:</td>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${safe(categoriaDenuncia)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Lugar:</td>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333;">${safe(lugarHechos)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">Descripción:</td>
                        <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; color:#333; line-height: 1.5;">${safe(descripcionHechos)}</td>
                      </tr>
                      <tr>
						  <td style="padding: 15px 0; border-bottom: 1px solid #f0f0f0; font-size:14px; font-weight:bold; color:#666;">
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
  }

  if (!EMAIL_TOWERANDTOWER || !PASS_TOWERANDTOWER || !SMTP_TOWERANDTOWER) {
    throw new Error("Configuración SMTP incompleta");
  }

  const PORT = Number(SMTP_PORT || 465);

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_TOWERANDTOWER,
      port: PORT,
      secure: false,
      auth: {
        user: EMAIL_TOWERANDTOWER,
        pass: PASS_TOWERANDTOWER,
      },
      connectionTimeout: 5000,
      sendTimeout: 10000,
      tls: { rejectUnauthorized: false }
    });


    const mailOptions = {
      from: `"Línea Ética - Tower and Tower" < ${EMAIL_TOWERANDTOWER}> `,
      to: correoDestino,
      subject: `Denuncia recibida - Código ${safe(codigoDenuncia)} `,
      text: `Denuncia recibida correctamente.`.trim(),
      html: mensaje_enviar,
      attachments: [
        {
          filename: "ESCUDO_ADVERTENCIA.png",
          path: `${FRONTEND_URL}/ESCUDO_ADVERTENCIA.png`,
          cid: "escudoAdvertencia"
        },
        {
          filename: "ESCUDO_CHECK.png",
          path: `/home/miguelnc/apps/LINEA_ETICA/frontend/public/ESCUDO_CHECK.png`,
          cid: "escudoCheck"
        }
      ]
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo");
  }
};

module.exports = enviarCorreo;
