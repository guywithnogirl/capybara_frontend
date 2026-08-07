import { useState } from "react";
import styles from "./Return.module.css";

export default function ReturnModal({
  isOpen,
  onClose,
  orderNumber,
}) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const whatsappNumber = "+918075792165";
  const supportEmail = "harisanthprplpy@gmail.com";

  const message = `
Hello,

I would like to request a return.

Order Number: ${orderNumber}

Reason:
${reason}
`;

  const openWhatsapp = () => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const openEmail = () => {
    window.location.href = `mailto:${supportEmail}?subject=Return Request - ${orderNumber}&body=${encodeURIComponent(message)}`;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <h2>Return Request</h2>

        <p className={styles.info}>
          If your product arrived damaged or incorrect,
          please contact our support team.
        </p>

        <div className={styles.notice}>
          <strong>Return Policy</strong>

          <ul>
            <li>✅ Returns accepted only for damaged or incorrect products.</li>
            <li>❌ Size change returns are not accepted.</li>
            <li>📦 Please contact us within 7 days of delivery.</li>
          </ul>
        </div>

        <textarea
          placeholder="Briefly describe your issue..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className={styles.actions}>
          <button
            className={styles.whatsapp}
            onClick={openWhatsapp}
          >
            WhatsApp
          </button>

          <button
            className={styles.email}
            onClick={openEmail}
          >
            Email
          </button>

          <button
            className={styles.close}
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}