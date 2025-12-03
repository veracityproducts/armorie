"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { VerseStudy } from "@/lib/storage/types";

// PDF styles using react-pdf StyleSheet
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#1a6e6e", // primary-700
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#0d3939", // primary-900
    marginBottom: 4,
  },
  reference: {
    fontSize: 14,
    color: "#2a8a8a", // primary-600
  },
  verseText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#374a5e", // accent-700
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#f0f5f5", // primary-50
    borderRadius: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0d3939", // primary-900
    marginBottom: 8,
  },
  studyCard: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#fafafa",
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#2a8a8a", // primary-600
  },
  keyword: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1a6e6e", // primary-700
    marginBottom: 4,
  },
  greekHebrew: {
    fontSize: 10,
    color: "#6b7e94", // accent-600
    marginBottom: 4,
  },
  meaning: {
    fontSize: 11,
    color: "#1e3a4d", // accent-800
    marginBottom: 6,
  },
  significance: {
    fontSize: 10,
    color: "#374a5e", // accent-700
    marginTop: 4,
    fontStyle: "italic",
  },
  references: {
    fontSize: 9,
    color: "#6b7e94", // accent-600
    marginTop: 4,
  },
  historicalSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#fef7f7", // secondary-50
    borderRadius: 4,
  },
  historicalTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#a3475f", // secondary-600
    marginBottom: 10,
  },
  historicalRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  historicalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#7a3348", // secondary-700
    width: 80,
  },
  historicalValue: {
    fontSize: 10,
    color: "#1e3a4d", // accent-800
    flex: 1,
  },
  culturalNotes: {
    marginTop: 8,
    fontSize: 10,
    color: "#374a5e", // accent-700
    fontStyle: "italic",
  },
  reflection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f0f5fa", // accent-50
    borderRadius: 4,
  },
  reflectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#374a5e", // accent-700
    marginBottom: 8,
  },
  reflectionText: {
    fontSize: 11,
    color: "#1e3a4d", // accent-800
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#9ab4c9", // accent-400
    borderTopWidth: 1,
    borderTopColor: "#d1e0eb", // accent-200
    paddingTop: 10,
  },
  date: {
    fontSize: 9,
    color: "#6b7e94", // accent-600
    marginTop: 4,
  },
});

interface StudyPDFDocumentProps {
  study: VerseStudy;
}

export function StudyPDFDocument({ study }: StudyPDFDocumentProps) {
  const formattedDate = new Date(study.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Verse Study</Text>
          <Text style={styles.reference}>{study.reference}</Text>
          <Text style={styles.date}>Created: {formattedDate}</Text>
        </View>

        {/* Verse Text */}
        <View style={styles.verseText}>
          <Text>{study.verse}</Text>
        </View>

        {/* Keyword Studies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keyword Studies</Text>
          {study.studies.map((s, index) => (
            <View key={index} style={styles.studyCard}>
              <Text style={styles.keyword}>{s.keyword}</Text>
              {s.greekHebrew && (
                <Text style={styles.greekHebrew}>{s.greekHebrew}</Text>
              )}
              <Text style={styles.meaning}>{s.meaning}</Text>
              {s.significance && (
                <Text style={styles.significance}>{s.significance}</Text>
              )}
              {s.references.length > 0 && (
                <Text style={styles.references}>
                  Cross-references: {s.references.join(", ")}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Historical Context */}
        {study.historicalContext && (
          <View style={styles.historicalSection}>
            <Text style={styles.historicalTitle}>Historical Context</Text>
            <View style={styles.historicalRow}>
              <Text style={styles.historicalLabel}>Period:</Text>
              <Text style={styles.historicalValue}>
                {study.historicalContext.period}
              </Text>
            </View>
            <View style={styles.historicalRow}>
              <Text style={styles.historicalLabel}>Author:</Text>
              <Text style={styles.historicalValue}>
                {study.historicalContext.author}
              </Text>
            </View>
            <View style={styles.historicalRow}>
              <Text style={styles.historicalLabel}>Audience:</Text>
              <Text style={styles.historicalValue}>
                {study.historicalContext.audience}
              </Text>
            </View>
            {study.historicalContext.events.length > 0 && (
              <View style={styles.historicalRow}>
                <Text style={styles.historicalLabel}>Events:</Text>
                <Text style={styles.historicalValue}>
                  {study.historicalContext.events.join("; ")}
                </Text>
              </View>
            )}
            {study.historicalContext.culturalNotes && (
              <Text style={styles.culturalNotes}>
                {study.historicalContext.culturalNotes}
              </Text>
            )}
          </View>
        )}

        {/* Reflection */}
        {study.reflection && (
          <View style={styles.reflection}>
            <Text style={styles.reflectionTitle}>Personal Reflection</Text>
            <Text style={styles.reflectionText}>{study.reflection}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Generated by Armorie - Your Bible Study Companion</Text>
        </View>
      </Page>
    </Document>
  );
}
