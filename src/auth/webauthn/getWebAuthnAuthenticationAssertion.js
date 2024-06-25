
// ------------------------------------------------------------------------------------------------
/**
 * Initiates the WebAuthn authentication process and returns an assertion.
 * @param {Object} props - The PublicKeyCredentialRequestOptions object containing the options for requesting an authentication assertion.
 * @param {Function} [callback] - Optional callback function to be called with the obtained assertion.
 * @returns {Promise<PublicKeyCredential|string>} A Promise that resolves to the obtained PublicKeyCredential or a message indicating that WebAuthn is not supported.
 * @throws {Error} If there is an error during the authentication process.
 */
async function getWebAuthnAuthenticationAssertion(props, callback) {
	try {
		if (
			!navigator ||
			!navigator.credentials ||
			!navigator.credentials.create ||
			!navigator.credentials.get
		) {
			return 'WebAuthn not supported';
		}
		validateAuthParams(props);

		const assertion = await navigator.credentials.get({
			publicKey: props
		});
		if (callback && typeof callback === 'function') {
			return options.callback(assertion);
		}

		return assertion;
	} catch (error) {
		throw error;
	}
}

// ------------------------------------------------------------------------------------------------

function validateAuthParams(props) {
	if (!props.challenge) {
		throw new Error('No challenge provided');
	}

	if (
		!props.allowCredentials ||
		!Array.isArray(props.allowCredentials) ||
		!props.allowCredentials.length
	) {
		throw new Error('No allowCredentials provided');
	}

	for (let ac of props.allowCredentials) {
		if (!ac.id) {
			throw new Error(
				'No allowCredentials (id) provided - The credential ID registered on the registration phase'
			);
		}
		if (!ac.type) {
			throw new Error('No allowCredentials (type) provided');
		}
	}

	return true;
}

// ------------------------------------------------------------------------------------------------

module.exports = getWebAuthnAuthenticationAssertion;

// ------------------------------------------------------------------------------------------------