/**
 * @file Módulo para iniciar o processo de autenticação WebAuthn no navegador.
 */

// ------------------------------------------------------------------------------------------------

/**
 * Valida se o objeto de propriedades fornecido contém todos os campos necessários
 * para uma chamada `navigator.credentials.get()`. Lança um erro se a validação falhar.
 *
 * @private
 * @param {PublicKeyCredentialRequestOptions} props - O objeto de opções a ser validado.
 * @throws {Error} Lança um erro descritivo se um campo obrigatório estiver ausente ou for inválido.
 */
function validateAuthenticationOptions(props) {
  // Valida a presença do 'challenge', que é essencial para prevenir ataques de repetição.
  if (!props.challenge) {
    throw new Error("No challenge provided");
  }

  // Valida a lista de credenciais permitidas. O autenticador usará esta lista
  // para encontrar uma credencial correspondente que o usuário possa usar para assinar.
  if (
    !props.allowCredentials ||
    !Array.isArray(props.allowCredentials) ||
    props.allowCredentials.length === 0
  ) {
    throw new Error("No allowCredentials provided");
  }

  // Itera sobre cada credencial permitida para garantir que sua estrutura está correta.
  for (const cred of props.allowCredentials) {
    if (!cred.id) {
      throw new Error(
        "No allowCredentials (id) provided - The credential ID registered on the registration phase"
      );
    }
    if (!cred.type) {
      throw new Error("No allowCredentials (type) provided");
    }
  }
}

// ------------------------------------------------------------------------------------------------

/**
 * Inicia o processo de autenticação WebAuthn no navegador e retorna uma asserção de autenticação.
 * Esta função é um wrapper para `navigator.credentials.get()`, adicionando validações
 * e suporte a um callback opcional para retrocompatibilidade.
 *
 * @param {PublicKeyCredentialRequestOptions} props - O objeto contendo as opções para solicitar uma asserção de autenticação.
 * @param {Function} [callback] - Função de callback opcional que será chamada com a asserção obtida como argumento.
 * @returns {Promise<PublicKeyCredential|string>} Uma promessa que resolve para o objeto `PublicKeyCredential` (a asserção),
 * ou para a string "WebAuthn not supported" se a API não estiver disponível.
 * @throws {Error} Lança um erro se ocorrer um problema durante o processo de autenticação (ex: validação falha, usuário cancela).
 */
async function getWebAuthnAuthenticationAssertion(props, callback) {
  // 1. Verificação de Suporte da API
  // Garante que a API WebAuthn para obter credenciais está disponível no navegador.
  if (typeof navigator?.credentials?.get !== "function") {
    return "WebAuthn not supported";
  }

  // 2. Validação dos Parâmetros
  // Executa uma verificação rigorosa das opções para garantir que a chamada à API será bem-sucedida.
  validateAuthenticationOptions(props);

  // 3. Obtenção da Asserção
  // Invoca a API nativa do navegador para solicitar uma asserção de autenticação.
  // O `await` pausa a execução até que o usuário prove sua identidade ao autenticador.
  const assertion = await navigator.credentials.get({
    publicKey: props,
  });

  // 4. Execução do Callback (Opcional)
  // Se um callback válido for fornecido, ele é invocado com a asserção.
  if (typeof callback === "function") {
    return callback(assertion);
  }

  // 5. Retorno da Promessa
  // Se nenhum callback for usado, a função retorna a asserção, resolvendo a promessa.
  return assertion;
}

// ------------------------------------------------------------------------------------------------

export default getWebAuthnAuthenticationAssertion;

// ------------------------------------------------------------------------------------------------
