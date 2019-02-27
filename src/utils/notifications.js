export function errorAlertOptions( message, err ) {
  const fullMessage = `${message}: <br><pre>${err}</pre>`;
  return {
    title: 'Error',
    message: fullMessage,
    type: 'is-danger',
  };
}
