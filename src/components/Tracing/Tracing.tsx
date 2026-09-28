import React, { useState, useMemo } from "react";
import styles from "./Tracing.module.sass";
import { parseBibtex, type Publication } from "./bibParser.ts";
import bibtexRawData from "./data/references.bib?raw";
import { MAIN_PIPELINE_STAGES, ALL_IN_ONE_STAGE } from "./diagram/diagramData";
import { NODE_TAG_MAPPING } from "./diagram/nodeTagMapping.ts";
import type { PipelineStage } from "./diagram/diagram.types.ts";

export const Tracing: React.FC = () => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [blockchainFilter, setBlockchainFilter] = useState<
    "utxo" | "account" | "agnostic" | null
  >(null);

  const publications: Publication[] = useMemo(() => {
    try {
      return parseBibtex(bibtexRawData);
    } catch (error) {
      console.error("Failed to parse references.bib:", error);
      return [];
    }
  }, []);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodes((prev) =>
      prev.includes(nodeId)
        ? prev.filter((id) => id !== nodeId)
        : [...prev, nodeId],
    );
  };

  const getNodeLabel = (nodeId: string): string => {
    if (nodeId === "bitcoin") return "Bitcoin (UTXO)";
    const allStages = [...MAIN_PIPELINE_STAGES, ALL_IN_ONE_STAGE];
    for (const stage of allStages) {
      if (stage.id === nodeId) return stage.title;
      for (const node of stage.nodes) {
        if (node.id === nodeId) return node.label;
        if (node.subNodes) {
          const sub = node.subNodes.find(
            (s: { id: string }) => s.id === nodeId,
          );
          if (sub) return sub.label;
        }
      }
    }
    return nodeId;
  };

  const selectedNodeLabels = useMemo(() => {
    return selectedNodes.map((nodeId) => getNodeLabel(nodeId));
  }, [selectedNodes]);

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      let matchesNodes = true;
      if (selectedNodes.length > 0) {
        matchesNodes = selectedNodes.some((nodeId) => {
          const targetTag = NODE_TAG_MAPPING[nodeId];
          if (targetTag) {
            const matchesTag = pub.methods.some(
              (m) => m.toLowerCase() === targetTag.toLowerCase(),
            );
            if (nodeId === "bitcoin") {
              return matchesTag || pub.blockchainType === "utxo";
            }
            return matchesTag;
          }
          const label = getNodeLabel(nodeId);
          return (
            pub.category === label ||
            pub.subCategory === label ||
            pub.methods.some((m) => m.toLowerCase() === label.toLowerCase())
          );
        });
      }

      const matchesBlockchain = blockchainFilter
        ? pub.blockchainType === blockchainFilter
        : true;
      return matchesNodes && matchesBlockchain;
    });
  }, [publications, selectedNodes, blockchainFilter]);

  const renderStageBox = (stage: PipelineStage) => (
    <div key={stage.id} className={styles.pipelineStage}>
      <button
        className={`${styles.stageHeaderButton} ${selectedNodes.includes(stage.id) ? styles.selected : ""}`}
        onClick={() => handleNodeClick(stage.id)}
      >
        <span className={styles.nodeText}>{stage.title}</span>
      </button>

      {stage.nodes.length > 0 && (
        <div className={styles.nodeList} style={{ marginTop: "0.875rem" }}>
          {stage.nodes.map((node) => (
            <div key={node.id}>
              <button
                className={`${styles.nodeButton} ${selectedNodes.includes(node.id) ? styles.selected : ""}`}
                onClick={() => handleNodeClick(node.id)}
              >
                <span className={styles.nodeText}>{node.label}</span>
              </button>

              {node.subNodes && node.subNodes.length > 0 && (
                <div className={styles.subNodeList}>
                  {node.subNodes.map((sub) => (
                    <button
                      key={sub.id}
                      className={`${styles.nodeButton} ${selectedNodes.includes(sub.id) ? styles.selected : ""}`}
                      onClick={() => handleNodeClick(sub.id)}
                    >
                      <span className={styles.nodeText}>{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.tracingContainer}>
      <div className={styles.header}>
        <h2>Blockchain Tracing Tools Taxonomy</h2>
        <p>
          Interactive taxonomy of tools, methods, and process steps across
          blockchain architectures.
        </p>
      </div>

      <div className={styles.flowchartSection}>
        <div className={styles.flowchartGrid}>
          {MAIN_PIPELINE_STAGES.map((stage, stageIdx) => (
            <React.Fragment key={stage.id}>
              {renderStageBox(stage)}
              {stageIdx < MAIN_PIPELINE_STAGES.length - 1 && (
                <div className={styles.pipelineArrow}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.specialStageWrapper}>
          {renderStageBox(ALL_IN_ONE_STAGE)}
        </div>

        <div className={styles.flowchartBottomRow}>
          <div className={styles.filterSectionGroup}>
            <div className={styles.legendBox}>
              <span className={styles.legendTitle}>Filter by Blockchain:</span>
              <div className={styles.legendItems}>
                <button
                  className={`${styles.legendItemButton} ${blockchainFilter === "utxo" ? styles.active : ""}`}
                  onClick={() =>
                    setBlockchainFilter(
                      blockchainFilter === "utxo" ? null : "utxo",
                    )
                  }
                >
                  <span className={`${styles.legendDot} ${styles.utxo}`} />
                  <span className={styles.legendText}>UTXO-Based Tools</span>
                </button>
                <button
                  className={`${styles.legendItemButton} ${blockchainFilter === "account" ? styles.active : ""}`}
                  onClick={() =>
                    setBlockchainFilter(
                      blockchainFilter === "account" ? null : "account",
                    )
                  }
                >
                  <span className={`${styles.legendDot} ${styles.account}`} />
                  <span className={styles.legendText}>Account-Based Tools</span>
                </button>
                <button
                  className={`${styles.legendItemButton} ${blockchainFilter === "agnostic" ? styles.active : ""}`}
                  onClick={() =>
                    setBlockchainFilter(
                      blockchainFilter === "agnostic" ? null : "agnostic",
                    )
                  }
                >
                  <span className={`${styles.legendDot} ${styles.agnostic}`} />
                  <span className={styles.legendText}>
                    Blockchain Agnostic Tools
                  </span>
                </button>
              </div>
            </div>

            {(selectedNodes.length > 0 || blockchainFilter) && (
              <button
                className={styles.clearFilterButton}
                onClick={() => {
                  setSelectedNodes([]);
                  setBlockchainFilter(null);
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeaderBar}>
          <div className={styles.tableHeaderLeft}>
            <h3>Publications</h3>
            <div className={styles.activeFiltersRow}>
              <span className={styles.filterLabel}>Active Filters:</span>
              {selectedNodeLabels.map((label) => (
                <span key={label} className={styles.filterChip}>
                  {label}
                </span>
              ))}
              {blockchainFilter && (
                <span
                  className={`${styles.filterChip} ${styles.blockchainChip}`}
                >
                  {blockchainFilter.toUpperCase()}-Based
                </span>
              )}
              {selectedNodeLabels.length === 0 && !blockchainFilter && (
                <span className={styles.filterLabel}>(None)</span>
              )}
            </div>
          </div>
          <div className={styles.resultsBadge}>
            {filteredPublications.length} result
            {filteredPublications.length !== 1 ? "s" : ""}
          </div>
        </div>

        {filteredPublications.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>
              No publications match your selected filter criteria.
            </p>
            <p className={styles.emptySubtitle}>
              Try selecting different filters or clearing your active filters.
            </p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Authors</th>
                  <th>Year</th>
                  <th>Methods</th>
                  <th className={styles.actionCell}>Link</th>
                </tr>
              </thead>
              <tbody>
                {filteredPublications.map((pub) => (
                  <tr key={pub.id}>
                    <td>
                      <div className={styles.pubTitle}>{pub.title}</div>
                    </td>
                    <td>
                      <div className={styles.pubAuthors}>{pub.authors}</div>
                    </td>
                    <td>
                      <span className={styles.yearTag}>{pub.year}</span>
                    </td>
                    <td>
                      <div className={styles.methodsGroup}>
                        {pub.methods.map((m) => (
                          <span key={m} className={styles.methodBadge}>
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={styles.actionCell}>
                      {pub.url ? (
                        <a
                          href={pub.url}
                          className={`${styles.actionButton} ${styles.view}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        <span className={styles.naText}>N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracing;
