import { useEffect, useState } from "react";
import { TOTP, HOTP, generateSecret } from "@sse-auth/authenticator";
import { QRCodeSVG } from "qrcode.react";

function App() {
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [otpUrl, setOtpUrl] = useState("");

  const handleGenerateSecret = () => {
    const newSecret = generateSecret();
    setSecret(newSecret.toString());
    const totp = new TOTP({
      secret,
      label: "SSE World",
      issuer: "SSE Testing",
      period: 30,
    });
    setOtpUrl(totp.url());
  };

  const handleGenerateToken = () => {
    const totp = new TOTP({
      secret,
      label: "SSE World",
      issuer: "SSE",
      period: 30,
    });
    const generatedToken = totp.token();
    setToken(generatedToken);
  };

  const handleVerifyCode = () => {
    const totp = new TOTP({
      secret,
      label: "SSE World",
      issuer: "SSE",
      period: 30,
    });
    const valid = totp.test(inputCode);
    setIsValid(valid);
  };

  useEffect(() => {
    console.log(isValid);
  }, [isValid]);

  return (
    <div>
      <h1>Two Step Verification</h1>
      <button onClick={handleGenerateSecret}>Generate Secret</button>
      {secret && (
        <div>
          <p>Secret: {secret}</p>
          <QRCodeSVG value={otpUrl} />
          <button onClick={handleGenerateToken}>Generate Token</button>
        </div>
      )}
      {token && <p>Generated Token: {token}</p>}
      <input
        type="text"
        placeholder="Enter verification code"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
      />
      <button onClick={handleVerifyCode}>Verify Code</button>
      {isValid !== null && (
        <p>{isValid ? "The code is valid!" : "The code is invalid."}</p>
      )}
    </div>
  );
}

export default App;
