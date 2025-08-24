/**
 * @file Módulo para iniciar o processo de registro WebAuthn no navegador.
 */

// ------------------------------------------------------------------------------------------------
/**
 * Valida se o objeto de propriedades fornecido contém todos os campos necessários
 * para uma chamada `navigator.credentials.create()`. Lança um erro se a validação falhar.
 *
 * @private
 * @param {PublicKeyCredentialCreationOptions} props - O objeto de opções a ser validado.
 * @throws {Error} Lança um erro descritivo se um campo obrigatório estiver ausente ou for inválido.
 */
function validateCreationOptions(props) {
  // Valida a presença do 'challenge', que é essencial para a segurança do protocolo.
  if (!props.challenge) {
    throw new Error("No challenge provided");
  }

  // Valida as informações da Relying Party (RP).
  if (!props.rp) {
    throw new Error("No RP (Relying Party) provided");
  }
  if (!props.rp.name) {
    throw new Error("No RP (Relying Party) name provided");
  }

  // Valida as informações do usuário.
  if (!props.user) {
    throw new Error("No user provided");
  }
  if (!props.user.id) {
    throw new Error("No user id provided");
  }
  if (!props.user.displayName) {
    throw new Error("No user display name provided");
  }
  if (!props.user.name) {
    throw new Error("No user name provided");
  }

  // Valida os parâmetros dos tipos de credenciais de chave pública aceitos.
  // Deve ser um array não vazio.
  if (
    !props.pubKeyCredParams ||
    !Array.isArray(props.pubKeyCredParams) ||
    props.pubKeyCredParams.length === 0
  ) {
    throw new Error("No pubKeyCredParams provided");
  }

  // Itera sobre cada parâmetro para garantir que a estrutura está correta.
  for (const param of props.pubKeyCredParams) {
    if (!param.hasOwnProperty("alg")) {
      throw new Error("No pubKeyCredParams.alg provided");
    }
    if (!param.hasOwnProperty("type")) {
      throw new Error("No pubKeyCredParams.type provided");
    }
  }
}

// ------------------------------------------------------------------------------------------------
/**
 * Inicia o processo de registro WebAuthn no navegador e retorna uma nova credencial.
 * Esta função é um wrapper para `navigator.credentials.create()`, adicionando validações
 * e suporte a um callback opcional.
 *
 * @param {PublicKeyCredentialCreationOptions} [props={}] - O objeto contendo as opções para a criação de uma nova credencial de chave pública.
 * @param {Function} [callback] - Função de callback opcional que será chamada com a credencial criada como argumento.
 * @returns {Promise<PublicKeyCredential|string>} Uma promessa que resolve para o objeto `PublicKeyCredential` criado,
 * ou para a string "WebAuthn not supported" se a API não estiver disponível no navegador.
 * @throws {Error} Lança um erro se ocorrer um problema durante o processo de criação da credencial (ex: validação falha, cancelamento do usuário).
 */
async function getWebAuthnRegistrationCredential(props = {}, callback) {
  // 1. Verificação de Suporte da API
  // Garante que a API WebAuthn está disponível no objeto `navigator` antes de prosseguir.
  // Esta função destina-se apenas a ambientes de navegador.
  if (typeof navigator?.credentials?.create !== "function") {
    return "WebAuthn not supported";
  }

  // 2. Validação dos Parâmetros
  // Executa uma verificação rigorosa das opções fornecidas para garantir que a chamada à API
  // seja bem-sucedida e evitar erros inesperados.
  validateCreationOptions(props);

  // 3. Criação da Credencial
  // Invoca a API nativa do navegador para solicitar a criação de uma nova credencial.
  // O `await` pausa a execução até que o usuário interaja com o prompt (ex: usando biometria)
  // e a promessa seja resolvida ou rejeitada.
  const credential = await navigator.credentials.create({
    publicKey: props,
  });

  // 4. Execução do Callback (Opcional)
  // Se um callback foi fornecido e é uma função válida, ele é invocado com a credencial.
  // Este padrão é mantido para garantir a retrocompatibilidade com a assinatura original.
  if (typeof callback === "function") {
    return callback(credential);
  }

  // 5. Retorno da Promessa
  // Se nenhum callback for usado, a função retorna a credencial, resolvendo a promessa.
  return credential;
}

// ------------------------------------------------------------------------------------------------

/**
 * Exporta a função para uso em módulos CommonJS.
 */
export default getWebAuthnRegistrationCredential;

// ------------------------------------------------------------------------------------------------
