// Plantillas adicionales de documentos de negociación para VORTAMAX Global.
// Traducciones jurídicas al español de las cinco plantillas base (NDA, LOI,
// MOU, SPA, COMMODITY_SPA) y nuevos tipos: mandato de intermediación (no
// exclusivo y exclusivo), acuerdo de participación / joint venture y contrato
// de suministro recurrente de commodities, en inglés y en español.
//
// Cada función devuelve el documento Markdown completo SIN el banner DRAFT:
// el motor de generación lo antepone. Todos los campos dinámicos provienen
// del contexto `c`; los datos faltantes se representan con placeholders
// [POR NEGOCIAR] / [TO BE NEGOTIATED] — nunca se inventan montos ni plazos.

export type Ctx = {
  sellerName: string; sellerCompany: string;
  buyerName: string; buyerCompany: string;
  assetTitle: string; assetLocation: string; jurisdiction: string;
  dealType?: string; amount?: number | null; equityPct?: number | null;
  termMonths?: number | null; exclusivityMonths?: number | null;
  commodity?: string | null; volume?: string | null; incoterm?: string | null;
  deliveryLocation?: string | null; priceDetails?: string | null;
  amountText: string; // ya formateado, ej. "USD 135,000,000" o "[AMOUNT TO BE CONFIRMED]"
};

/* -------------------------------------------------------------------------- */
/* Helpers — bloques de partes y firmas (ES / EN)                             */
/* -------------------------------------------------------------------------- */

/**
 * Bloque de partes en español. Los rótulos son parametrizables para los
 * contratos en que las partes no son "Vendedor"/"Comprador" (p. ej.
 * intermediación: "el Cliente" / "el Intermediario").
 * @param {Ctx} c
 * @param {string} [sellerLabel]
 * @param {string} [buyerLabel]
 */
function partiesBlockEs(c: Ctx, sellerLabel = 'el "Vendedor" / la "Parte Reveladora"', buyerLabel = 'el "Comprador" / la "Parte Receptora"') {
  const sl = sellerLabel;
  const bl = buyerLabel;
  return `**ENTRE:**

**${c.sellerCompany}** (representada por ${c.sellerName}), en adelante ${sl};

**Y**

**${c.buyerCompany}** (representada por ${c.buyerName}), en adelante ${bl};

(cada una, una "Parte" y, conjuntamente, las "Partes").
`;
}

/**
 * Bloque de firmas en español, en tabla, con encabezados parametrizables.
 * @param {Ctx} c
 * @param {string} [sellerHeader]
 * @param {string} [buyerHeader]
 */
function signatureBlockEs(c: Ctx, sellerHeader = "Por el Vendedor", buyerHeader = "Por el Comprador") {
  const sh = sellerHeader;
  const bh = buyerHeader;
  return `
---

**FIRMAS**

| ${sh} | ${bh} |
| --- | --- |
| ${c.sellerCompany} | ${c.buyerCompany} |
| Nombre: ${c.sellerName} | Nombre: ${c.buyerName} |
| Cargo: ______________________ | Cargo: ______________________ |
| Fecha: ______________________ | Fecha: ______________________ |
| Firma: __________________ | Firma: __________________ |
`;
}

/**
 * Parties block in English, mirroring the original templates, with
 * parameterizable role labels (e.g. Client / Intermediary).
 * @param {Ctx} c
 * @param {string} [sellerLabel]
 * @param {string} [buyerLabel]
 */
function partiesBlockEn(c: Ctx, sellerLabel = 'the "Seller" / "Disclosing Party"', buyerLabel = 'the "Buyer" / "Receiving Party"') {
  const sl = sellerLabel;
  const bl = buyerLabel;
  return `**BETWEEN:**

**${c.sellerCompany}** (represented by ${c.sellerName}), hereinafter ${sl};

**AND**

**${c.buyerCompany}** (represented by ${c.buyerName}), hereinafter ${bl};

(each a "Party" and together the "Parties").
`;
}

/**
 * Signature block in English, mirroring the original templates.
 * @param {Ctx} c
 * @param {string} [sellerHeader]
 * @param {string} [buyerHeader]
 */
function signatureBlockEn(c: Ctx, sellerHeader = "For the Seller", buyerHeader = "For the Buyer") {
  const sh = sellerHeader;
  const bh = buyerHeader;
  return `
---

**SIGNATURES**

| ${sh} | ${bh} |
| --- | --- |
| ${c.sellerCompany} | ${c.buyerCompany} |
| Name: ${c.sellerName} | Name: ${c.buyerName} |
| Title: ______________________ | Title: ______________________ |
| Date: ______________________ | Date: ______________________ |
| Signature: __________________ | Signature: __________________ |
`;
}

/** Plazo en meses (ES) o placeholder. @param {number | null | undefined} m */
const mesesEs = (m?: number | null) => (m != null ? `${m} meses` : "[POR NEGOCIAR]");

/** Term in months (EN) or placeholder. @param {number | null | undefined} m */
const monthsEn = (m?: number | null) => (m != null ? `${m} months` : "[TO BE NEGOTIATED]");

/* -------------------------------------------------------------------------- */
/* 1. Traducciones al español de las cinco plantillas base                     */
/* -------------------------------------------------------------------------- */

/**
 * Acuerdo de Confidencialidad (traducción del NDA base).
 * @param {Ctx} c
 */
export function ndaTemplateEs(c: Ctx) {
  return `# ACUERDO DE CONFIDENCIALIDAD

**Ref.: Evaluación de "${c.assetTitle}" (${c.assetLocation})**

${partiesBlockEs(c)}

**1. Objeto.** La Parte Reveladora pondrá a disposición cierta información confidencial de carácter técnico, financiero, legal y comercial relativa a ${c.assetTitle} (la "Información Confidencial"), exclusivamente para permitir a la Parte Receptora evaluar una posible transacción sobre el activo (el "Objeto").

**2. Información Confidencial.** Comprende toda la información revelada a través del data room de VORTAMAX Global o por cualquier otro medio, en cualquier formato, incluidas la existencia y el estado de las negociaciones. Se excluye la información que sea o llegue a ser pública sin mediar incumplimiento, que hubiese sido conocida lícitamente con anterioridad a su revelación o que sea desarrollada de forma independiente.

**3. Obligaciones.** La Parte Receptora deberá: (a) utilizar la Información Confidencial únicamente para el Objeto; (b) no revelarla a terceros sin consentimiento previo y por escrito, salvo a asesores sujetos a deberes equivalentes; (c) protegerla con un cuidado no inferior al razonable; (d) no contactar a empleados, clientes, proveedores o autoridades relacionados con el activo sin autorización.

**4. Devolución o Destrucción.** A solicitud escrita o al término de las conversaciones, la Parte Receptora deberá devolver o destruir toda la Información Confidencial y certificar su destrucción, con sujeción a los requisitos legales de conservación.

**5. Ausencia de Licencia / Ausencia de Obligación.** No se otorga licencia ni derecho de propiedad alguno. Ninguna de las Partes queda obligada a celebrar transacción alguna.

**6. Vigencia.** El presente Acuerdo permanecerá en vigor por tres (3) años contados desde la fecha de su firma.

**7. Remedios.** Las Partes reconocen que una revelación no autorizada puede causar un daño irreparable; la Parte Reveladora podrá solicitar medidas cautelares, además de cualquier otro remedio disponible.

**8. Ley Aplicable y Jurisdicción.** El presente Acuerdo se rige por las leyes de ${c.jurisdiction}. Las controversias se someterán a los tribunales competentes de ${c.jurisdiction}, salvo que las Partes acuerden arbitraje.

${signatureBlockEs(c)}`;
}

/**
 * Carta de Intención no vinculante (traducción de la LOI base).
 * @param {Ctx} c
 */
export function loiTemplateEs(c: Ctx) {
  return `# CARTA DE INTENCIÓN (NO VINCULANTE)

**Ref.: Transacción propuesta sobre "${c.assetTitle}" (${c.assetLocation})**

${partiesBlockEs(c)}

**1. Transacción.** El Comprador expresa su intención no vinculante de llevar adelante una transacción sobre ${c.assetTitle}, estructurada como ${c.dealType ?? "[ESTRUCTURA POR CONFIRMAR]"}${c.equityPct ? ` por una participación del ${c.equityPct}%` : ""}.

**2. Contraprestación Indicativa.** ${c.amountText}, sujeta a debida diligencia confirmatoria, sobre una base libre de caja y de deuda (cash-free/debt-free) y sujeta a los ajustes habituales.

**3. Contexto de la Oferta.** [CONTEXTO DE LA OFERTA — POR NEGOCIAR]

**4. Debida Diligencia.** El Vendedor otorgará al Comprador y a sus asesores acceso a un data room con información técnica, financiera, legal, tributaria y ambiental. Se prevé que el período de debida diligencia sea de [60] días contados desde la aceptación de esta Carta.

**5. Exclusividad.** [El Vendedor otorga al Comprador exclusividad por un período de [45] días contados desde la fecha de esta Carta. / No se otorga exclusividad.]

**6. Confidencialidad.** El Acuerdo de Confidencialidad suscrito entre las Partes permanece plenamente vigente.

**7. Naturaleza No Vinculante.** Salvo por las Secciones 5 a 7, esta Carta constituye una declaración de intención y no crea obligación vinculante alguna de consumar transacción alguna.

**8. Ley Aplicable.** ${c.jurisdiction}.

${signatureBlockEs(c)}`;
}

/**
 * Memorándum de Entendimiento (traducción del MOU base).
 * @param {Ctx} c
 */
export function mouTemplateEs(c: Ctx) {
  return `# MEMORÁNDUM DE ENTENDIMIENTO

**Ref.: "${c.assetTitle}" (${c.assetLocation})**

${partiesBlockEs(c)}

**1. Objeto.** El presente Memorándum deja constancia del entendimiento común de las Partes sobre los términos principales en negociación para una transacción sobre ${c.assetTitle} y organiza el plan de trabajo hacia los acuerdos definitivos.

**2. Estructura Contemplada.** ${c.dealType ?? "[POR CONFIRMAR]"}${c.equityPct ? `, que involucra una participación del ${c.equityPct}%` : ""}, por una contraprestación indicativa de ${c.amountText}.

**3. Plan de Trabajo.**
| Fase | Entregable | Plazo Objetivo |
| --- | --- | --- |
| 1 | Debida diligencia confirmatoria | [T + 60 días] |
| 2 | Redacción de los acuerdos definitivos | [T + 90 días] |
| 3 | Aprobaciones regulatorias y condiciones suspensivas | [T + 150 días] |
| 4 | Cierre | [T + 180 días] |

**4. Conducción del Negocio.** Hasta el cierre o la terminación, el Vendedor operará el activo en el curso ordinario y no constituirá nuevos gravámenes fuera del curso ordinario.

**5. Costos.** Cada Parte asumirá sus propios costos. [Los mecanismos de comisión de ruptura (break-fee), de existir, se definirán en los acuerdos definitivos.]

**6. Confidencialidad y Anuncios.** El Acuerdo de Confidencialidad suscrito permanece vigente. No se efectuará anuncio público alguno sin el consentimiento previo y por escrito de ambas Partes.

**7. Naturaleza.** El presente Memorándum no es vinculante, salvo por las Secciones 5 a 7, y no constituye oferta, aceptación ni acuerdo definitivo.

**8. Ley Aplicable.** ${c.jurisdiction}.

${signatureBlockEs(c)}`;
}

/**
 * Contrato de Compraventa (traducción del SPA base).
 * @param {Ctx} c
 */
export function spaTemplateEs(c: Ctx) {
  return `# ${c.equityPct && c.equityPct < 100 ? "CONTRATO DE COMPRAVENTA DE ACCIONES / DE PARTICIPACIÓN" : "CONTRATO DE COMPRAVENTA DE ACTIVOS / ACCIONES"} — BORRADOR MARCO

**Ref.: "${c.assetTitle}" (${c.assetLocation})**

${partiesBlockEs(c)}

**1. Objeto.** El Vendedor se obliga a vender y el Comprador se obliga a adquirir ${c.equityPct ? `una participación del ${c.equityPct}% en` : "la totalidad de"} ${c.assetTitle}, libre de gravámenes y cargas, salvo lo divulgado.

**2. Precio de Compra.** ${c.amountText}, pagadero de la siguiente forma: [estructura de pago — p. ej., % a la firma, % al cierre, componentes diferidos/earn-out — POR NEGOCIAR].

**3. Condiciones Suspensivas.** El cierre queda sujeto a: (a) conclusión satisfactoria de la debida diligencia confirmatoria; (b) aprobaciones regulatorias y de libre competencia, cuando corresponda; (c) consentimientos de terceros y renuncias a derechos preferentes; (d) ausencia de cambio material adverso; (e) [otras].

**4. Declaraciones y Garantías.** El Vendedor declara, entre otras: titularidad válida y capacidad; regularidad societaria; exactitud de la información divulgada; cumplimiento de permisos y de las obligaciones ambientales, laborales y tributarias; inexistencia de litigios no divulgados. El Comprador declara capacidad, facultades suficientes y disponibilidad de fondos.

**5. Indemnizaciones.** El Vendedor indemnizará al Comprador por los incumplimientos de sus declaraciones, con sujeción a los topes (caps), canastas (baskets), umbrales de minimis y períodos de supervivencia que se negocien. [Indemnizaciones específicas: ambientales, tributarias, litigios — POR NEGOCIAR.]

**6. Compromisos.** Operación en el curso ordinario entre la firma y el cierre; obligaciones de no competencia y de no captación por [3] años; servicios de transición según se requiera.

**7. Ley Aplicable y Resolución de Controversias.** El presente Contrato se rige por las leyes de ${c.jurisdiction}. Las controversias se resolverán de manera definitiva conforme al reglamento de [CCI/centro de arbitraje local], con sede en [ciudad], en idioma español/inglés.

**8. Misceláneos.** Cláusulas de notificaciones, restricciones a la cesión, acuerdo íntegro, divisibilidad y ejemplares, a ser completadas por los abogados de las Partes.

${signatureBlockEs(c)}`;
}

/**
 * Contrato de Compraventa de Commodities (traducción del COMMODITY_SPA base).
 * @param {Ctx} c
 */
export function commoditySpaTemplateEs(c: Ctx) {
  return `# CONTRATO DE COMPRAVENTA DE COMMODITIES — BORRADOR MARCO

**Ref.: ${c.commodity ?? "[COMMODITY]"} — "${c.assetTitle}"**

${partiesBlockEs(c)}

**1. Producto y Especificaciones.** El Vendedor venderá y el Comprador comprará ${c.commodity ?? "[COMMODITY]"} conforme a las especificaciones técnicas anexas al presente Contrato (Anexo A — Certificado de Análisis). Las entregas no conformes podrán ser rechazadas o quedar sujetas a ajuste de precio conforme a la Cláusula 6.

**2. Cantidad y Programa de Entregas.** ${c.volume ?? "[CANTIDAD / PERIODICIDAD]"}, con tolerancias de ±5% a opción del Vendedor, salvo acuerdo en contrario.

**3. Términos de Entrega.** ${c.incoterm ?? "[INCOTERM]"} ${c.deliveryLocation ?? "[LUGAR/PUERTO DESIGNADO]"} (Incoterms® 2020). La titularidad y el riesgo se transfieren conforme al Incoterm acordado.

**4. Precio.** ${c.priceDetails ?? "[BASE DE PRECIO — fija o indexada (p. ej., LME) con prima/descuento]"}. Los mecanismos de revisión de precio y del período de cotización serán detallados por las Partes.

**5. Pago.** [Carta de crédito irrevocable a la vista / cobranza documentaria / cuenta abierta — POR NEGOCIAR], contra presentación de los documentos de embarque habituales.

**6. Determinación de Calidad.** Inspector independiente en el puerto de carga/descarga; pesaje, muestreo y ensayo conforme a los estándares de la industria; análisis dirimente (umpire) en caso de controversia.

**7. Laycan, Demoras y Logística.** A programarse conforme al programa de entregas; demoras (demurrage) y despacho (despatch) conforme a los términos del contrato de fletamento.

**8. Fuerza Mayor.** Se aplican las protecciones estándar de fuerza mayor; la Parte afectada deberá notificar con prontitud y mitigar los efectos.

**9. Cumplimiento Normativo.** Cada Parte garantiza el cumplimiento de la normativa sobre sanciones, anticorrupción, prevención del lavado de activos y abastecimiento responsable aplicable a la transacción.

**10. Ley Aplicable y Arbitraje.** Leyes de ${c.jurisdiction}; las controversias se someterán a [arbitraje CCI/LME], con sede en [ciudad], en idioma español/inglés.

> **Nota de plataforma:** VORTAMAX Global conecta a las Partes y facilita la negociación. El pago y la logística son ejecutados por las Partes a través de los canales comerciales tradicionales, fuera de la plataforma.

${signatureBlockEs(c)}`;
}

/* -------------------------------------------------------------------------- */
/* 2. Mandato de Intermediación NO exclusivo (EN / ES)                        */
/* -------------------------------------------------------------------------- */

/**
 * Non-exclusive intermediation mandate. The counterparty (buyerCompany) is
 * VORTAMAX Global acting as Intermediary.
 * @param {Ctx} c
 */
export function intermediationTemplateEn(c: Ctx) {
  return `# NON-EXCLUSIVE INTERMEDIATION MANDATE

**Re: Promotion of "${c.assetTitle}" (${c.assetLocation})**

${partiesBlockEn(c, 'the "Client"', 'the "Intermediary"')}

**1. Object.** The Client authorizes the Intermediary, on a non-exclusive basis, to promote ${c.assetTitle} and to introduce it to potential investors through the VORTAMAX Global platform and the Intermediary's professional network.

**2. Non-Exclusive Scope.** This mandate is non-exclusive. The Client remains free to offer the asset directly or through other channels or intermediaries, provided that any introduction made by the Intermediary remains subject to Clauses 5 and 6.

**3. Obligations of the Intermediary.** The Intermediary shall: (a) publish and promote the asset on the platform in accordance with its listing standards; (b) perform reasonable verification of the information provided by the Client prior to publication; (c) introduce to the Client interested parties that have expressed credible interest; (d) keep the Client reasonably informed of the status of such introductions.

**4. Obligations of the Client.** The Client shall: (a) provide truthful, accurate and up-to-date information concerning the asset; (b) deliver the documentation reasonably required for publication and verification; (c) promptly notify the Intermediary of any material change affecting the asset or its availability.

**5. Success Fee.** Upon closing of a transaction with a party introduced by the Intermediary, the Client shall pay the Intermediary a success fee of [TO BE NEGOTIATED]% of the transaction value, payable at closing. No fee accrues if no transaction closes.

**6. Term.** This mandate remains in force for ${monthsEn(c.termMonths)} from the date of signature, renewable by written agreement. Either Party may terminate upon [30] days' prior written notice, without prejudice to fees accrued in respect of introductions already made.

**7. Confidentiality.** Each Party shall keep confidential the commercial and technical information received under this mandate and use it solely for the purposes hereof, subject to disclosures required by law.

**8. No Legal or Financial Advice.** The Intermediary connects the parties and facilitates negotiation only; it does not provide legal, tax or financial advice, does not act as a securities broker, and does not guarantee the closing of any transaction. Each Party must rely on its own qualified advisors.

**9. Governing Law.** This mandate is governed by the laws of ${c.jurisdiction}. Disputes shall be submitted to the competent courts of ${c.jurisdiction}, unless the Parties agree to arbitration.

${signatureBlockEn(c, "For the Client", "For the Intermediary")}`;
}

/**
 * Mandato de intermediación no exclusivo. La contraparte (buyerCompany) es
 * VORTAMAX Global en calidad de Intermediario.
 * @param {Ctx} c
 */
export function intermediationTemplateEs(c: Ctx) {
  return `# MANDATO DE INTERMEDIACIÓN NO EXCLUSIVO

**Ref.: Promoción de "${c.assetTitle}" (${c.assetLocation})**

${partiesBlockEs(c, 'el "Cliente"', 'el "Intermediario"')}

**1. Objeto.** El Cliente autoriza al Intermediario, con carácter no exclusivo, a promover ${c.assetTitle} y a presentarlo a potenciales inversionistas a través de la plataforma VORTAMAX Global y de la red profesional del Intermediario.

**2. Alcance No Exclusivo.** El presente mandato es no exclusivo. El Cliente conserva la libertad de ofrecer el activo directamente o a través de otros canales o intermediarios, en el entendido de que toda presentación efectuada por el Intermediario permanece sujeta a las Cláusulas 5 y 6.

**3. Obligaciones del Intermediario.** El Intermediario deberá: (a) publicar y difundir el activo en la plataforma conforme a sus estándares de publicación; (b) efectuar una verificación razonable de la información proporcionada por el Cliente antes de su publicación; (c) presentar al Cliente a los interesados que hayan manifestado un interés creíble; (d) mantener al Cliente razonablemente informado del estado de dichas presentaciones.

**4. Obligaciones del Cliente.** El Cliente deberá: (a) proporcionar información veraz, exacta y actualizada sobre el activo; (b) entregar la documentación razonablemente requerida para la publicación y verificación; (c) notificar con prontitud al Intermediario cualquier cambio material que afecte al activo o a su disponibilidad.

**5. Honorarios de Éxito.** Al cierre de una transacción con un interesado presentado por el Intermediario, el Cliente pagará al Intermediario honorarios de éxito equivalentes al [POR NEGOCIAR]% del valor de la transacción, pagaderos al cierre. No se devengarán honorarios si no se cierra transacción alguna.

**6. Vigencia.** El presente mandato permanecerá en vigor por ${mesesEs(c.termMonths)} contados desde la fecha de su firma, renovable por acuerdo escrito. Cualquiera de las Partes podrá terminarlo con un preaviso escrito de [30] días, sin perjuicio de los honorarios devengados respecto de presentaciones ya efectuadas.

**7. Confidencialidad.** Cada Parte mantendrá la confidencialidad de la información comercial y técnica recibida en virtud del presente mandato y la utilizará únicamente para los fines del mismo, con sujeción a las revelaciones exigidas por ley.

**8. No Asesoría Legal ni Financiera.** El Intermediario se limita a conectar a las partes y facilitar la negociación; no presta asesoría legal, tributaria ni financiera, no actúa como corredor de valores y no garantiza el cierre de transacción alguna. Cada Parte debe apoyarse en sus propios asesores calificados.

**9. Ley Aplicable.** El presente mandato se rige por las leyes de ${c.jurisdiction}. Las controversias se someterán a los tribunales competentes de ${c.jurisdiction}, salvo que las Partes acuerden arbitraje.

${signatureBlockEs(c, "Por el Cliente", "Por el Intermediario")}`;
}

/* -------------------------------------------------------------------------- */
/* 3. Mandato de Intermediación EXCLUSIVO (EN / ES)                           */
/* -------------------------------------------------------------------------- */

/**
 * Exclusive intermediation mandate, with exclusivity undertaking and a
 * 12-month tail-period protection for introduced contacts.
 * @param {Ctx} c
 */
export function intermediationExclusiveTemplateEn(c: Ctx) {
  return `# EXCLUSIVE INTERMEDIATION MANDATE

**Re: Exclusive promotion of "${c.assetTitle}" (${c.assetLocation})**

${partiesBlockEn(c, 'the "Client"', 'the "Intermediary"')}

**1. Object.** The Client appoints the Intermediary, on an exclusive basis, to promote ${c.assetTitle} and to introduce it to potential investors through the VORTAMAX Global platform and the Intermediary's professional network.

**2. Exclusivity.** For a period of ${monthsEn(c.exclusivityMonths)} from the date of signature, the Client shall not offer, promote or list the asset through any other channel or intermediary, nor negotiate a transaction over the asset with third parties other than those introduced by the Intermediary, except with the Intermediary's prior written consent.

**3. Obligations of the Intermediary.** The Intermediary shall: (a) publish and actively promote the asset on the platform in accordance with its listing standards; (b) perform reasonable verification of the information provided by the Client prior to publication; (c) introduce to the Client interested parties that have expressed credible interest; (d) report periodically on promotion activity and the status of introductions.

**4. Obligations of the Client.** The Client shall: (a) provide truthful, accurate and up-to-date information concerning the asset; (b) deliver the documentation reasonably required for publication and verification; (c) refer to the Intermediary any approach received from third parties during the exclusivity period; (d) promptly notify any material change affecting the asset or its availability.

**5. Success Fee.** Upon closing of a transaction over the asset during the term of this mandate, the Client shall pay the Intermediary a success fee of [TO BE NEGOTIATED]% of the transaction value, payable at closing.

**6. Tail Period.** For twelve (12) months following expiry or termination of this mandate, the success fee shall remain due for any transaction closed with a party introduced by the Intermediary during the term, as recorded in the introduction log kept on the platform.

**7. Term.** This mandate remains in force for ${monthsEn(c.termMonths)} from the date of signature, renewable by written agreement. Early termination by the Client during the exclusivity period requires [TO BE NEGOTIATED].

**8. Confidentiality.** Each Party shall keep confidential the commercial and technical information received under this mandate and use it solely for the purposes hereof, subject to disclosures required by law.

**9. No Legal or Financial Advice.** The Intermediary connects the parties and facilitates negotiation only; it does not provide legal, tax or financial advice, does not act as a securities broker, and does not guarantee the closing of any transaction. Each Party must rely on its own qualified advisors.

**10. Governing Law.** This mandate is governed by the laws of ${c.jurisdiction}. Disputes shall be submitted to the competent courts of ${c.jurisdiction}, unless the Parties agree to arbitration.

${signatureBlockEn(c, "For the Client", "For the Intermediary")}`;
}

/**
 * Mandato de intermediación exclusivo, con cláusula de exclusividad y
 * protección de cola (tail period) de 12 meses para contactos presentados.
 * @param {Ctx} c
 */
export function intermediationExclusiveTemplateEs(c: Ctx) {
  return `# MANDATO DE INTERMEDIACIÓN EXCLUSIVO

**Ref.: Promoción exclusiva de "${c.assetTitle}" (${c.assetLocation})**

${partiesBlockEs(c, 'el "Cliente"', 'el "Intermediario"')}

**1. Objeto.** El Cliente designa al Intermediario, con carácter exclusivo, para promover ${c.assetTitle} y presentarlo a potenciales inversionistas a través de la plataforma VORTAMAX Global y de la red profesional del Intermediario.

**2. Exclusividad.** Durante un período de ${mesesEs(c.exclusivityMonths)} contados desde la fecha de firma, el Cliente no podrá ofrecer, promover ni publicar el activo por ningún otro canal o intermediario, ni negociar una transacción sobre el activo con terceros distintos de los presentados por el Intermediario, salvo consentimiento previo y por escrito del Intermediario.

**3. Obligaciones del Intermediario.** El Intermediario deberá: (a) publicar y promover activamente el activo en la plataforma conforme a sus estándares de publicación; (b) efectuar una verificación razonable de la información proporcionada por el Cliente antes de su publicación; (c) presentar al Cliente a los interesados que hayan manifestado un interés creíble; (d) informar periódicamente sobre la actividad de promoción y el estado de las presentaciones.

**4. Obligaciones del Cliente.** El Cliente deberá: (a) proporcionar información veraz, exacta y actualizada sobre el activo; (b) entregar la documentación razonablemente requerida para la publicación y verificación; (c) derivar al Intermediario todo acercamiento recibido de terceros durante el período de exclusividad; (d) notificar con prontitud cualquier cambio material que afecte al activo o a su disponibilidad.

**5. Honorarios de Éxito.** Al cierre de una transacción sobre el activo durante la vigencia del presente mandato, el Cliente pagará al Intermediario honorarios de éxito equivalentes al [POR NEGOCIAR]% del valor de la transacción, pagaderos al cierre.

**6. Protección de Cola (Tail Period).** Durante los doce (12) meses siguientes al vencimiento o terminación del presente mandato, los honorarios de éxito seguirán siendo exigibles respecto de cualquier transacción cerrada con un interesado presentado por el Intermediario durante la vigencia, según conste en el registro de presentaciones llevado en la plataforma.

**7. Vigencia.** El presente mandato permanecerá en vigor por ${mesesEs(c.termMonths)} contados desde la fecha de su firma, renovable por acuerdo escrito. La terminación anticipada por el Cliente durante el período de exclusividad requerirá [POR NEGOCIAR].

**8. Confidencialidad.** Cada Parte mantendrá la confidencialidad de la información comercial y técnica recibida en virtud del presente mandato y la utilizará únicamente para los fines del mismo, con sujeción a las revelaciones exigidas por ley.

**9. No Asesoría Legal ni Financiera.** El Intermediario se limita a conectar a las partes y facilitar la negociación; no presta asesoría legal, tributaria ni financiera, no actúa como corredor de valores y no garantiza el cierre de transacción alguna. Cada Parte debe apoyarse en sus propios asesores calificados.

**10. Ley Aplicable.** El presente mandato se rige por las leyes de ${c.jurisdiction}. Las controversias se someterán a los tribunales competentes de ${c.jurisdiction}, salvo que las Partes acuerden arbitraje.

${signatureBlockEs(c, "Por el Cliente", "Por el Intermediario")}`;
}

/* -------------------------------------------------------------------------- */
/* 4. Acuerdo de Participación / Joint Venture (EN / ES)                      */
/* -------------------------------------------------------------------------- */

/**
 * Joint venture / participation agreement — draft framework.
 * @param {Ctx} c
 */
export function jvTemplateEn(c: Ctx) {
  return `# JOINT VENTURE / PARTICIPATION AGREEMENT — DRAFT FRAMEWORK

**Re: "${c.assetTitle}" (${c.assetLocation})**

${partiesBlockEn(c, 'the "Asset Owner"', 'the "Investor"')}

**1. Purpose.** The Parties wish to explore the formation of a joint venture for the development and operation of ${c.assetTitle} (the "Project") and hereby record the principal terms under discussion.

**2. Contributions.** The Asset Owner would contribute ${c.assetTitle}, together with its associated permits, contracts and information; the Investor would contribute [capital, technology and/or management capabilities — TO BE NEGOTIATED]. Indicative overall valuation of the Project: ${c.amountText}, subject to due diligence and final valuation of contributions.

**3. Tentative Participation.** The Parties contemplate a participation of ${c.equityPct ? `${c.equityPct}% for the Investor` : "[TO BE NEGOTIATED]"} in the joint venture vehicle, subject to the final valuation of contributions and the definitive agreements.

**4. Governance.** A steering committee with equal representation of both Parties shall oversee the Project. Key decisions — annual budget and business plan, additional capital calls, indebtedness, transfers of interests, related-party transactions and material contracts — shall require unanimity.

**5. Negotiation Exclusivity.** For ninety (90) days from the date of signature, the Parties shall negotiate exclusively with each other in respect of the Project and shall not solicit, entertain or pursue competing proposals concerning the asset.

**6. Conditions to Definitive Agreement.** Execution of definitive agreements is subject to: (a) satisfactory completion of due diligence; (b) corporate, regulatory and antitrust approvals where applicable; (c) agreement on the constitutional documents and shareholders' agreement of the joint venture vehicle; (d) [others].

**7. Confidentiality.** Each Party shall keep confidential the information exchanged in connection with the Project; the Non-Disclosure Agreement executed between the Parties, if any, remains in full force.

**8. Nature.** Except for Clauses 5 and 7, this Agreement is non-binding, does not create a partnership or company between the Parties, and does not oblige either Party to consummate the joint venture.

**9. Governing Law.** This Agreement is governed by the laws of ${c.jurisdiction}. Disputes shall be submitted to the competent courts of ${c.jurisdiction}, unless the Parties agree to arbitration.

${signatureBlockEn(c, "For the Asset Owner", "For the Investor")}`;
}

/**
 * Acuerdo de participación / joint venture — borrador marco.
 * @param {Ctx} c
 */
export function jvTemplateEs(c: Ctx) {
  return `# ACUERDO DE PARTICIPACIÓN / JOINT VENTURE — BORRADOR MARCO

**Ref.: "${c.assetTitle}" (${c.assetLocation})**

${partiesBlockEs(c, 'el "Titular del Activo"', 'el "Inversionista"')}

**1. Objeto.** Las Partes desean explorar la constitución de un joint venture para el desarrollo y operación de ${c.assetTitle} (el "Proyecto") y dejan constancia de los términos principales en discusión.

**2. Aportes.** El Titular del Activo aportaría ${c.assetTitle}, junto con sus permisos, contratos e información asociados; el Inversionista aportaría [capital, tecnología y/o capacidades de gestión — POR NEGOCIAR]. Valorización global indicativa del Proyecto: ${c.amountText}, sujeta a debida diligencia y a la valorización final de los aportes.

**3. Participación Tentativa.** Las Partes contemplan una participación del ${c.equityPct ? `${c.equityPct}% para el Inversionista` : "[POR NEGOCIAR]"} en el vehículo del joint venture, sujeta a la valorización final de los aportes y a los acuerdos definitivos.

**4. Gobernanza.** Un comité directivo con representación paritaria de ambas Partes supervisará el Proyecto. Las decisiones clave — presupuesto anual y plan de negocios, aportes de capital adicionales, endeudamiento, transferencias de participaciones, operaciones con partes relacionadas y contratos materiales — requerirán unanimidad.

**5. Exclusividad de Negociación.** Durante noventa (90) días contados desde la fecha de firma, las Partes negociarán de manera exclusiva entre sí respecto del Proyecto y no solicitarán, atenderán ni impulsarán propuestas competidoras sobre el activo.

**6. Condiciones para el Acuerdo Definitivo.** La suscripción de los acuerdos definitivos queda sujeta a: (a) conclusión satisfactoria de la debida diligencia; (b) aprobaciones societarias, regulatorias y de libre competencia, cuando corresponda; (c) acuerdo sobre los estatutos y el pacto de accionistas del vehículo del joint venture; (d) [otras].

**7. Confidencialidad.** Cada Parte mantendrá la confidencialidad de la información intercambiada en relación con el Proyecto; el Acuerdo de Confidencialidad suscrito entre las Partes, de existir, permanece plenamente vigente.

**8. Naturaleza.** Salvo por las Cláusulas 5 y 7, el presente Acuerdo no es vinculante, no crea sociedad ni asociación alguna entre las Partes y no obliga a ninguna de ellas a consumar el joint venture.

**9. Ley Aplicable.** El presente Acuerdo se rige por las leyes de ${c.jurisdiction}. Las controversias se someterán a los tribunales competentes de ${c.jurisdiction}, salvo que las Partes acuerden arbitraje.

${signatureBlockEs(c, "Por el Titular del Activo", "Por el Inversionista")}`;
}

/* -------------------------------------------------------------------------- */
/* 5. Contrato de Suministro recurrente de commodities (EN / ES)              */
/* -------------------------------------------------------------------------- */

/**
 * Recurring commodity supply agreement — draft framework.
 * @param {Ctx} c
 */
export function commoditySupplyTemplateEn(c: Ctx) {
  return `# RECURRING COMMODITY SUPPLY AGREEMENT — DRAFT FRAMEWORK

**Re: ${c.commodity ?? "[COMMODITY]"} — "${c.assetTitle}"**

${partiesBlockEn(c, 'the "Supplier"', 'the "Buyer"')}

**1. Product.** The Supplier shall supply and the Buyer shall purchase ${c.commodity ?? "[COMMODITY]"} conforming to the technical specifications annexed to this Agreement (Annex A — Product Specifications). Non-conforming deliveries are subject to rejection or price adjustment as per Clauses 7 and 8.

**2. Periodic Volume.** ${c.volume ?? "[VOLUME / PERIODICITY]"} per delivery period, in accordance with the delivery schedule of Clause 4.

**3. Term.** This Agreement remains in force for ${monthsEn(c.termMonths)} from the first delivery, renewable by written agreement of the Parties.

**4. Delivery Schedule.** Deliveries shall follow the calendar set out in Annex B (Delivery Schedule); the Buyer shall nominate quantities and windows with [15] days' prior written notice, subject to the periodic volume of Clause 2.

**5. Price.** ${c.priceDetails ?? "[Index-linked price basis with premium/discount — TO BE NEGOTIATED]"}. Invoicing per delivery; payment terms [irrevocable letter of credit / documentary collection / open account — TO BE NEGOTIATED].

**6. Delivery Terms.** ${c.incoterm ?? "[INCOTERM]"} ${c.deliveryLocation ?? "[NAMED PLACE/PORT]"} (Incoterms® 2020). Title and risk pass in accordance with the agreed Incoterm.

**7. Quality & Certificates.** Each delivery shall be accompanied by a certificate of analysis and certificate of origin issued by [accredited laboratory/authority]. The Supplier warrants conformity with Annex A at the delivery point.

**8. Inspection.** Independent surveyor at load/discharge point; weighing, sampling and assay per industry standards; umpire analysis in case of dispute, with costs borne by the non-prevailing Party.

**9. Default & Tolerances.** Delivery and quantity tolerances of ±10% per period are permitted without constituting breach. Shortfalls beyond tolerance entitle the affected Party to [cover damages / price adjustment — TO BE NEGOTIATED]; persistent breach entitles the affected Party to terminate with written notice.

**10. Force Majeure.** Standard force majeure protections apply; the affected Party shall notify promptly, mitigate, and deliveries shall resume once the event ceases. Prolonged force majeure beyond [90] days entitles either Party to terminate.

**11. Governing Law & Arbitration.** This Agreement is governed by the laws of ${c.jurisdiction}; disputes shall be finally settled under [ICC/local arbitration rules], seat in [city], language English/Spanish.

> **Platform note:** VORTAMAX Global connects the Parties and facilitates negotiation. Payment and logistics are executed by the Parties through traditional trade channels outside the platform.

${signatureBlockEn(c, "For the Supplier", "For the Buyer")}`;
}

/**
 * Contrato de suministro recurrente de commodities — borrador marco.
 * @param {Ctx} c
 */
export function commoditySupplyTemplateEs(c: Ctx) {
  return `# CONTRATO DE SUMINISTRO RECURRENTE DE COMMODITIES — BORRADOR MARCO

**Ref.: ${c.commodity ?? "[COMMODITY]"} — "${c.assetTitle}"**

${partiesBlockEs(c, 'el "Proveedor"', 'el "Comprador"')}

**1. Producto.** El Proveedor suministrará y el Comprador adquirirá ${c.commodity ?? "[COMMODITY]"} conforme a las especificaciones técnicas anexas al presente Contrato (Anexo A — Especificaciones del Producto). Las entregas no conformes podrán ser rechazadas o quedar sujetas a ajuste de precio conforme a las Cláusulas 7 y 8.

**2. Volumen Periódico.** ${c.volume ?? "[VOLUMEN / PERIODICIDAD]"} por período de entrega, conforme al calendario de entregas de la Cláusula 4.

**3. Vigencia.** El presente Contrato permanecerá en vigor por ${mesesEs(c.termMonths)} contados desde la primera entrega, renovable por acuerdo escrito de las Partes.

**4. Calendario de Entregas.** Las entregas se efectuarán conforme al calendario del Anexo B (Programa de Entregas); el Comprador nominará cantidades y ventanas con un preaviso escrito de [15] días, con sujeción al volumen periódico de la Cláusula 2.

**5. Precio.** ${c.priceDetails ?? "[Base de precio indexada con prima/descuento — POR NEGOCIAR]"}. Facturación por entrega; condiciones de pago [carta de crédito irrevocable / cobranza documentaria / cuenta abierta — POR NEGOCIAR].

**6. Términos de Entrega.** ${c.incoterm ?? "[INCOTERM]"} ${c.deliveryLocation ?? "[LUGAR/PUERTO DESIGNADO]"} (Incoterms® 2020). La titularidad y el riesgo se transfieren conforme al Incoterm acordado.

**7. Calidad y Certificados.** Cada entrega deberá acompañarse de un certificado de análisis y un certificado de origen emitidos por [laboratorio/autoridad acreditados]. El Proveedor garantiza la conformidad con el Anexo A en el punto de entrega.

**8. Inspección.** Inspector independiente en el punto de carga/descarga; pesaje, muestreo y ensayo conforme a los estándares de la industria; análisis dirimente (umpire) en caso de controversia, con costos a cargo de la Parte no favorecida.

**9. Incumplimiento y Tolerancias.** Se admiten tolerancias de entrega y de cantidad de ±10% por período sin que constituyan incumplimiento. Los déficits que excedan la tolerancia darán derecho a la Parte afectada a [daños de cobertura / ajuste de precio — POR NEGOCIAR]; el incumplimiento persistente facultará a la Parte afectada a terminar el Contrato mediante notificación escrita.

**10. Fuerza Mayor.** Se aplican las protecciones estándar de fuerza mayor; la Parte afectada deberá notificar con prontitud y mitigar los efectos, y las entregas se reanudarán una vez cesado el evento. La fuerza mayor prolongada por más de [90] días facultará a cualquiera de las Partes a terminar el Contrato.

**11. Ley Aplicable y Arbitraje.** El presente Contrato se rige por las leyes de ${c.jurisdiction}; las controversias se resolverán de manera definitiva conforme al [reglamento de arbitraje CCI/local], con sede en [ciudad], en idioma español/inglés.

> **Nota de plataforma:** VORTAMAX Global conecta a las Partes y facilita la negociación. El pago y la logística son ejecutados por las Partes a través de los canales comerciales tradicionales, fuera de la plataforma.

${signatureBlockEs(c, "Por el Proveedor", "Por el Comprador")}`;
}

export const __TEMPLATE_COUNT = 13;
