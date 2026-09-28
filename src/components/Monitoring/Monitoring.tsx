import React, { useState } from "react";
import styles from "./Monitoring.module.sass";

export type TaxonomyCategory =
  | "Regulatory / Risk Indicators"
  | "Rule-Based Monitoring Tool"
  | "AI-Based Monitoring Tool";

export type RiskLevel = "High" | "Medium" | "Low";

export type TxInfo = {
  caseId: string;
  caseDescription: string;
  riskJustification: string;
  txList: string[];
};

export type Row = {
  address: string;
  entityName?: string;
  risk: RiskLevel;
  detectedBy?: TaxonomyCategory | null;
  transactions?: TxInfo | null;
};

const initialData: Row[] = [
  {
    address: "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
    entityName: "Ronin Bridge Exploiter (Lazarus Group)",
    risk: "High",
    detectedBy: "AI-Based Monitoring Tool",
    transactions: {
      caseId: "CASE-ID-101 (Mock Data)",
      caseDescription:
        "Cross-chain bridge exploit and multi-hop token laundering.",
      riskJustification:
        "Identified via global graph mining algorithms detecting abnormal cross-chain liquidity drains.",
      txList: [
        "0xc28ed40228383a15233e5ef2b378eb88f341b5380ee48b0a944626ff48a6046e",
        "0xa18f921319c3d420f1a52b8221b2289c89281a810985bf29f9e20a0219bd1e12",
      ],
    },
  },
  {
    address: "1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX",
    entityName: "Silk Road Seized Wallet Reserve",
    risk: "High",
    detectedBy: "Regulatory / Risk Indicators",
    transactions: {
      caseId: "CASE-ID-102 (Mock Data)",
      caseDescription:
        "Dark Web illicit marketplace transactions and asset forfeiture.",
      riskJustification:
        "Direct match against OFAC law enforcement sanctions lists and FATF illicit marketplace red-flag indicators.",
      txList: [
        "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
        "e3bf3d07d4b0375638d9f11a80e8e906c28f3227909062955f19024095a5f1b2",
      ],
    },
  },
  {
    address: "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo",
    entityName: "Hydra Market Associated Cashout Node",
    risk: "High",
    detectedBy: "Rule-Based Monitoring Tool",
    transactions: {
      caseId: "CASE-ID-103 (Mock Data)",
      caseDescription:
        "Automated rapid transfers routed through coin mixing protocol.",
      riskJustification:
        "State invariant rules triggered due to high-velocity split transactions (<3 blocks) to sanctioned obfuscation pools.",
      txList: [
        "8f8e12089201a4e1b38f802998a109283e810a92810a0a9182910a82910a9101",
        "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      ],
    },
  },
  {
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    entityName: "Possible Phishing Campaign",
    risk: "Medium",
    detectedBy: "AI-Based Monitoring Tool",
    transactions: {
      caseId: "CASE-ID-104 (Mock Data)",
      caseDescription:
        "Social engineering phishing ring transferring victim approvals.",
      riskJustification:
        "Unsupervised graph topology analysis detected abnormal fan-in density signals across newly created addresses.",
      txList: [
        "0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
        "0xffeeddccbbaa00998877665544332211ffeeddccbbaa00998877665544332211",
      ],
    },
  },
  {
    address: "bc1ql49ydapnjafl5t2cp9zqpjwe6pdgmxy98859v2",
    entityName: "Standard Retail Exchange Wallet",
    risk: "Low",
    detectedBy: null,
    transactions: null,
  },
];

export const Monitoring: React.FC = () => {
  const [expandedAddr, setExpandedAddr] = useState<string | null>(null);

  const toggleExpand = (address: string) => {
    setExpandedAddr(expandedAddr === address ? null : address);
  };

  const getTaxonomyBadgeClass = (category?: TaxonomyCategory | null) => {
    switch (category) {
      case "Regulatory / Risk Indicators":
        return styles.badgeRegulatory;
      case "Rule-Based Monitoring Tool":
        return styles.badgeRule;
      case "AI-Based Monitoring Tool":
        return styles.badgeAi;
      default:
        return "";
    }
  };

  return (
    <section className="content-section">
      <h1>Monitoring</h1>
      <p className={styles.subtitle}>
        Real-time transaction surveillance interface mapping flagged wallet
        addresses directly to taxonomy detection mechanisms, regulatory
        watchlists, and graph analytics.
      </p>

      {/* Desktop & Tablet Table View */}
      <div className={styles.tableWrapper}>
        <table className={styles.monitoringTable}>
          <thead>
            <tr>
              <th>Address & Identified Entity</th>
              <th>Risk Level</th>
              <th>Detected By</th>
              <th>Further Information</th>
            </tr>
          </thead>
          <tbody>
            {initialData.map((row) => {
              const isExpanded = expandedAddr === row.address;
              const hasTool = row.risk !== "Low" && row.detectedBy;

              return (
                <React.Fragment key={row.address}>
                  <tr className={isExpanded ? styles.activeRow : ""}>
                    <td className={styles.tableCell}>
                      <div className={styles.addrCell}>
                        <span
                          className={styles.addressText}
                          title={row.address}
                        >
                          {row.address}
                        </span>
                        {row.entityName && (
                          <span className={styles.entityTag}>
                            {row.entityName}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <span
                        className={`${styles.riskPill} ${styles[`risk${row.risk}`]}`}
                      >
                        {row.risk}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {hasTool ? (
                        <span
                          className={`${styles.taxonomyBadge} ${getTaxonomyBadgeClass(row.detectedBy)}`}
                        >
                          {row.detectedBy}
                        </span>
                      ) : (
                        <span className={styles.noToolDash}>—</span>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      {row.transactions ? (
                        <button
                          className={`${styles.expandToggle} ${isExpanded ? styles.expanded : ""}`}
                          onClick={() => toggleExpand(row.address)}
                          aria-expanded={isExpanded}
                        >
                          <span>
                            {isExpanded ? "Hide Details" : "View Case Details"}
                          </span>
                          <span className={styles.chevron}>❯</span>
                        </button>
                      ) : (
                        <span className={styles.noRiskText}>
                          No Anomaly Detected
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Case Details Drawer */}
                  {isExpanded && row.transactions && (
                    <tr className={styles.expandedRow}>
                      <td colSpan={4} className={styles.expandedCell}>
                        <div className={styles.txCard}>
                          <div className={styles.txHeader}>
                            <strong>Case Reference:</strong>{" "}
                            {row.transactions.caseId}
                          </div>
                          <div className={styles.txField}>
                            <strong>Case Description:</strong>{" "}
                            {row.transactions.caseDescription}
                          </div>
                          <div className={styles.txField}>
                            <strong>Risk Justification:</strong>
                            <p className={styles.justificationText}>
                              {row.transactions.riskJustification}
                            </p>
                          </div>
                          <div className={styles.txField}>
                            <strong>
                              Flagged Transactions (
                              {row.transactions.txList.length}):
                            </strong>
                            <ul className={styles.txList}>
                              {row.transactions.txList.map((tx, idx) => (
                                <li key={idx} className={styles.txItem}>
                                  <code>{tx}</code>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Adaptive Cards */}
      <div className={styles.mobileCardsList}>
        {initialData.map((row) => {
          const isExpanded = expandedAddr === row.address;
          const hasTool = row.risk !== "Low" && row.detectedBy;

          return (
            <div key={row.address} className={styles.mobileCard}>
              <div className={styles.mobileCardHeader}>
                <span
                  className={`${styles.riskPill} ${styles[`risk${row.risk}`]}`}
                >
                  {row.risk} Risk
                </span>
                {hasTool && (
                  <span
                    className={`${styles.taxonomyBadge} ${getTaxonomyBadgeClass(row.detectedBy)}`}
                  >
                    {row.detectedBy}
                  </span>
                )}
              </div>

              <div className={styles.mobileAddrBlock}>
                <label>Address:</label>
                <code className={styles.mobileAddress}>{row.address}</code>
                {row.entityName && (
                  <div className={styles.entityTag}>{row.entityName}</div>
                )}
              </div>

              {row.transactions ? (
                <>
                  <button
                    className={`${styles.mobileExpandToggle} ${isExpanded ? styles.expanded : ""}`}
                    onClick={() => toggleExpand(row.address)}
                  >
                    <span>
                      {isExpanded ? "Hide Details" : "View Case Details"}
                    </span>
                    <span className={styles.chevron}>❯</span>
                  </button>

                  {isExpanded && (
                    <div className={styles.txCardMobile}>
                      <div>
                        <strong>Case Ref:</strong> {row.transactions.caseId}
                      </div>
                      <div>
                        <strong>Case Summary:</strong>{" "}
                        {row.transactions.caseDescription}
                      </div>
                      <div>
                        <strong>Risk Driver:</strong>
                        <p className={styles.justificationText}>
                          {row.transactions.riskJustification}
                        </p>
                      </div>
                      <div>
                        <strong>Flagged TXs:</strong>
                        <ul className={styles.txList}>
                          {row.transactions.txList.map((tx, i) => (
                            <li key={i} className={styles.txItem}>
                              <code>{tx}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.noRiskText}>No Anomaly Detected</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
