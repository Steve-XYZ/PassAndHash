const StrengthMeter = ({ password }) => {
  const checkPasswordStrength = (password) => {
    let score = 0;
    const checks = [
      /.{8,}/, // length
      /[A-Z]/, // uppercase
      /[a-z]/, // lowercase
      /[0-9]/, // numbers
      /[^A-Za-z0-9]/, // symbols
    ];

    checks.forEach((regex) => {
      if (regex.test(password)) {
        score++;
      }
    });

    switch (score) {
      case 0:
      case 1:
      case 2:
        return { text: 'Débil', width: '25%', class: 'weak' };
      case 3:
        return { text: 'Media', width: '50%', class: 'medium' };
      case 4:
        return { text: 'Fuerte', width: '75%', class: 'strong' };
      case 5:
        return { text: 'Muy Fuerte', width: '100%', class: 'very-strong' };
      default:
        return { text: '', width: '0%', class: '' };
    }
  };

  const strength = checkPasswordStrength(password);

  return (
    <div
      id="password-strength-meter"
      className="strength-meter"
      style={{ visibility: password.length > 0 ? 'visible' : 'hidden' }}
    >
      <div id="strength-bar-container" className="strength-bar-container">
        <div
          id="strength-bar"
          className={`strength-bar ${strength.class}`}
          style={{ width: strength.width }}
        ></div>
      </div>
      <div id="strength-text" className={`strength-text ${strength.class}`}>
        {strength.text}
      </div>
    </div>
  );
};

export default StrengthMeter;
