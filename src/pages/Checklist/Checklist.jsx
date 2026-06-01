import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'thesis_checklist'
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'req', label: 'Required sections' },
  { key: 'fmt', label: 'Formatting' },
  { key: 'apa', label: 'APA 6th ed.' },
  { key: 'lang', label: 'Language & grammar' },
  { key: 'content', label: 'Content & structure' },
  { key: 'stat', label: 'Statistics & data' },
]

const TAG_STYLES = {
  req: 'bg-sky-100 text-sky-800 border-sky-200',
  fmt: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  apa: 'bg-amber-100 text-amber-900 border-amber-200',
  lang: 'bg-rose-100 text-rose-800 border-rose-200',
  content: 'bg-violet-100 text-violet-800 border-violet-200',
  stat: 'bg-indigo-100 text-indigo-800 border-indigo-200',
}

const DATA = [
  {
    title: 'Paper Setup & Formatting',
    items: [
      { text: 'Paper size is 8.5" × 11" (letter size)', tags: ['fmt'] },
      { text: 'Double (2) spacing applied throughout the entire manuscript', tags: ['fmt'] },
      { text: 'Exception: figure and table titles use single spacing', tags: ['fmt'] },
      { text: 'Top margin is 1.0"', tags: ['fmt'] },
      { text: 'Right margin is 1.0"', tags: ['fmt'] },
      { text: 'Bottom margin is 1.0"', tags: ['fmt'] },
      { text: 'Left margin is 1.5"', tags: ['fmt'] },
      { text: 'Font style is Times New Roman throughout', tags: ['fmt'] },
      { text: 'Chapter headings (Chapters 1–5) use font size 14', tags: ['fmt'] },
      { text: 'Side headings and titles of chapters/content use font size 12', tags: ['fmt'] },
      { text: 'All figure and table titles use font size 12, except Figure 1 schema title which must be size 14', tags: ['fmt'] },
      { text: 'Headings and side headings are in bold face', tags: ['fmt'] },
      { text: 'All other parts (non-headings) are in normal (not bold) face', tags: ['fmt'] },
      { text: 'Chapter heading numeral system is consistent throughout (Roman or Arabic — not mixed)', tags: ['fmt'] },
      { text: 'Page numbers are correct, continuous, and free of artifacts or duplicates', tags: ['fmt'] },
      { text: 'Front matter pages use Roman numerals; body pages use Arabic numerals', tags: ['fmt'] },
    ],
  },
  {
    title: 'Front Matter — Required Sections',
    items: [
      { text: 'Title page is present and correctly formatted (Annex A)', tags: ['req'] },
      { text: 'Title page does not say "A Thesis Writing" — must say "A Thesis"', tags: ['req', 'lang'] },
      { text: 'Institutional header appears only once on the title page (not duplicated)', tags: ['req', 'fmt'] },
      { text: 'Certification page is present and correctly filled out (Annex B)', tags: ['req'] },
      { text: 'Certification language attests to thesis submission — not to an exam or integrative paper', tags: ['req', 'content'] },
      { text: 'Approval Sheet is present and correctly formatted (Annex C)', tags: ['req'] },
      { text: 'Abstract is present', tags: ['req'] },
      { text: 'Abstract covers: purpose, research design, respondents, key findings, and conclusions — in that order', tags: ['req', 'content'] },
      { text: 'Keywords are broad conceptual terms appropriate for indexing — not subvariables', tags: ['req', 'content'] },
      { text: 'Dedication is present', tags: ['req'] },
      { text: 'Acknowledgment is present', tags: ['req'] },
      { text: 'Table of Contents is present and accurate', tags: ['req', 'fmt'] },
      { text: 'Table of Contents does not contain duplicate entries', tags: ['req', 'fmt'] },
      { text: 'List of Tables is present', tags: ['req'] },
      { text: 'List of Figures is present', tags: ['req'] },
      { text: 'List of Figures appears in Table of Contents as a properly numbered entry', tags: ['req', 'fmt'] },
      { text: 'Front matter sections appear in correct order: Title Page → Certification → Approval Sheet → Abstract → Dedication → Acknowledgment → List of Tables → List of Figures', tags: ['req', 'fmt'] },
    ],
  },
  {
    title: 'Chapter 1 — The Problem and Its Scope',
    items: [
      { text: 'Introduction starts with a macro idea and narrows to a micro problem rationale', tags: ['content'] },
      { text: 'Introduction is preferably 2–3 pages — not excessively long or repetitive', tags: ['content'] },
      { text: 'Introduction does not pre-empt the Theoretical Framework discussion', tags: ['content'] },
      { text: 'Theoretical/Conceptual Framework anchors the study to a named theory with proper citation', tags: ['content'] },
      { text: 'All theories mentioned in the framework are operationalized in the study — remove theories that are not applied', tags: ['content'] },
      { text: 'Framework discussion follows the flow of variables in the schema', tags: ['content'] },
      { text: 'Last paragraph of the framework discusses the schema of the study', tags: ['content'] },
      { text: 'Schema/Figure 1 is presented on a separate page after the framework discussion', tags: ['fmt'] },
      { text: 'Figure 1 caption follows APA 6th ed. format (below figure, italicized, sentence case)', tags: ['apa', 'fmt'] },
      { text: 'No term or definition is repeated twice in the Conceptual Framework discussion', tags: ['content'] },
      { text: 'Statement of the Problem is structured in two clearly separated parts: General SOP and Specific SOP', tags: ['content'] },
      { text: 'General SOP answers the wh-questions (what, who, where, when) about the study', tags: ['content'] },
      { text: 'Specific SOP presents numbered specific objectives', tags: ['content'] },
      { text: 'Research Questions are listed separately after the Specific SOP', tags: ['content'] },
      { text: 'Research question lead-in uses a colon, not a semicolon', tags: ['lang'] },
      { text: 'Sub-questions are uniformly indented and consistently punctuated', tags: ['fmt', 'lang'] },
      { text: 'Null hypotheses are provided for all inferential research questions', tags: ['content'] },
      { text: 'Hypothesis for correlation questions uses "relationship" not "difference"', tags: ['content', 'lang'] },
      { text: 'Hypothesis subscript notation is consistent (H₀₁, H₀₂, etc. — not mixed bold/superscript)', tags: ['fmt'] },
      { text: 'Significance of the Study explains how each stakeholder benefits from the findings — not how they contribute data', tags: ['content'] },
      { text: 'Significance section is written in present or future tense (prospective)', tags: ['lang'] },
      { text: 'Significance section contains no past tense verbs (e.g., "enabled" → "enables")', tags: ['lang'] },
      { text: 'Scope and Delimitation is presented as one combined section, not two separate subsections', tags: ['content', 'fmt'] },
      { text: 'Scope and Delimitation explicitly identifies the independent variable and dependent variable', tags: ['content'] },
      { text: 'Scope section does not contain methodological details (those belong in Chapter 3)', tags: ['content'] },
      { text: 'Definition of Terms terms are arranged strictly alphabetically', tags: ['content'] },
      { text: 'Definition of Terms includes only terms found in the title, schema, or variables', tags: ['content'] },
      { text: 'Definition of Terms are operational definitions of how each term is used in the study', tags: ['content'] },
    ],
  },
  {
    title: 'Chapter 2 — Review of Related Literature',
    items: [
      { text: 'Chapter 2 opens with an introductory paragraph that orients the reader to the chapter’s thematic structure', tags: ['content'] },
      { text: 'Introductory paragraph states the time range of sources reviewed', tags: ['content'] },
      { text: 'Introductory paragraph does not pre-emptively summarize the gap', tags: ['content'] },
      { text: 'Literature is thematically arranged — not chronologically or by author', tags: ['content'] },
      { text: 'Subheadings follow the same order as the variables in the conceptual framework and research questions', tags: ['content'] },
      { text: 'Each subheading is a noun phrase — not a complete sentence', tags: ['lang'] },
      { text: 'Subheadings are placed correctly before their respective content', tags: ['content'] },
      { text: 'Each subheading’s content does not bleed into another variable’s section', tags: ['content'] },
      { text: 'Local and Regional Studies section is sufficiently substantive (not just 2–3 citations)', tags: ['content'] },
      { text: 'Chapter ends with a single subheading: “Synthesis and Gap” — not split into separate sections', tags: ['content', 'fmt'] },
      { text: 'No “Conclusion” subheading appears within Chapter 2', tags: ['content'] },
      { text: 'Synthesis and Gap section synthesizes connections across themes — not just summaries side by side', tags: ['content'] },
      { text: 'Synthesis and Gap section identifies the specific research gap that this study addresses', tags: ['content'] },
    ],
  },
  {
    title: 'Chapter 3 — Research Methodology',
    items: [
      { text: 'All verbs in Chapter 3 are in past tense (study has been conducted)', tags: ['lang'] },
      { text: 'Research Environment describes the condition where the study was conducted — not anecdotal episodes', tags: ['content'] },
      { text: 'Research Environment describes the organizational/administrative context of the setting', tags: ['content'] },
      { text: 'Research Environment explains why the setting is significant to the study', tags: ['content'] },
      { text: 'Sampling method described matches the actual approach used', tags: ['content'] },
      { text: 'Research Instrument section specifies the number of items per part and per subscale', tags: ['content'] },
      { text: 'Research Instrument section names the source/reference for each adapted instrument', tags: ['content'] },
      { text: 'If instrument is modified/adapted, this is clearly stated and described', tags: ['content'] },
      { text: 'Validation of instrument describes how the instrument was validated', tags: ['content'] },
      { text: 'If instrument is not standardized, describe how it was made and validated', tags: ['content'] },
      { text: 'Reliability coefficient (Cronbach’s alpha or equivalent) is reported', tags: ['content', 'stat'] },
      { text: 'Scoring procedure includes ranges, descriptions, and interpretations of scores', tags: ['content'] },
      { text: 'Scoring rubric label matches the variable being measured', tags: ['content', 'lang'] },
      { text: 'All scoring sections use the same Likert scale consistently', tags: ['stat', 'content'] },
      { text: 'Redundant scoring tables are removed — one official rubric per variable is sufficient', tags: ['content'] },
      { text: 'Statistical Treatment section uses correct subject-verb agreement', tags: ['lang'] },
      { text: 'Statistical tools listed are internally consistent — no mixing of parametric and non-parametric without justification', tags: ['stat'] },
      { text: 'If regression is used, justify treating Likert data as interval-level or report normality tests', tags: ['stat'] },
      { text: 'Statistical tools listed in Chapter 3 match the tools actually used in Chapter 4', tags: ['stat'] },
      { text: 'Statistical Tools table (if present) has correct sequential numbering of objectives', tags: ['fmt'] },
      { text: 'Ethical considerations mention consent, confidentiality, voluntary participation, and data privacy', tags: ['content'] },
      { text: 'If REC/UREC approval is mentioned, a copy of the clearance is attached as an annex', tags: ['req'] },
    ],
  },
  {
    title: 'Chapter 4 — Presentation, Analysis, and Interpretation of Data',
    items: [
      { text: 'Chapter 4 opens with an introductory paragraph mapping content to research questions', tags: ['content'] },
      { text: 'Tables are presented first, followed by discussion and interpretation', tags: ['content'] },
      { text: 'Table narrative descriptions match the table they introduce', tags: ['content'] },
      { text: 'Table numbers in the narrative match actual table numbers in the document', tags: ['content'] },
      { text: 'Verbal interpretations in tables match the interpretive labels used in the narrative discussion', tags: ['content', 'stat'] },
      { text: 'Scoring legend/scale in Chapter 4 tables matches the rubric defined in Chapter 3', tags: ['stat', 'content'] },
      { text: 'Score range values in tables are mathematically valid (lower bound < upper bound)', tags: ['stat'] },
      { text: 'Scale descriptors match the type of variable being measured', tags: ['stat', 'content'] },
      { text: 'All missing description/interpretation cells in summary tables are filled in', tags: ['content'] },
      { text: 'Each table discussion offers unique analysis specific to that dimension', tags: ['content'] },
      { text: 'No stray text fragments, copy-paste remnants, or incomplete sentences in discussions', tags: ['lang'] },
      { text: 'Counter-intuitive or unexpected findings are given adequate theoretical explanation', tags: ['content'] },
      { text: 'Questionnaire items are placed under the correct indicator/subscale', tags: ['content'] },
      { text: 'Questionnaire scale descriptors are in correct order and consistent across all parts', tags: ['content'] },
      { text: 'Questionnaire typos are corrected', tags: ['lang'] },
      { text: 'Statistical results are reported in correct APA format (F, r, p, df, CI notation)', tags: ['apa', 'stat'] },
    ],
  },
  {
    title: 'Chapter 5 — Summary, Findings, Conclusions, and Recommendations',
    items: [
      { text: 'Chapter 5 heading is plural: "Conclusions" and "Recommendations" — not singular', tags: ['lang'] },
      { text: 'Summary describes the study purpose, research design, respondents, and statistical tools used', tags: ['content'] },
      { text: 'Findings section is structured to mirror the exact order of the research questions in Chapter 1', tags: ['content'] },
      { text: 'Each finding is clearly labeled and corresponds to a specific research question', tags: ['content'] },
      { text: 'Only one "Conclusions" heading appears in the chapter — no duplicate heading', tags: ['content', 'fmt'] },
      { text: 'Conclusions are presented in paragraph form', tags: ['content'] },
      { text: 'Each conclusion flows logically from a specific finding', tags: ['content'] },
      { text: 'Recommendations are doable and grounded in the study’s own findings', tags: ['content'] },
      { text: 'Future research recommendations are clearly labeled as such (separate from practical recommendations)', tags: ['content', 'fmt'] },
      { text: 'Recommendations formatting is consistent (all numbered, or all bulleted — not mixed)', tags: ['fmt'] },
    ],
  },
  {
    title: 'APA 6th Edition — Tables',
    items: [
      { text: 'Table label ("Table X") is above the table, flush left, plain text — not bold or italicized', tags: ['apa', 'fmt'] },
      { text: 'Table title is on the next line below the label, flush left, italicized, title case', tags: ['apa', 'fmt'] },
      { text: 'Tables have no vertical lines — only horizontal lines at top, below headers, and at bottom', tags: ['apa', 'fmt'] },
      { text: 'Table notes appear below the table, introduced by "Note." in bold italics followed by a period', tags: ['apa', 'fmt'] },
      { text: 'Table notes explain all abbreviations used', tags: ['apa'] },
      { text: 'All tables except significance tests are presented before their discussions', tags: ['apa', 'content'] },
      { text: 'Table numbering is sequential and consistent throughout the entire manuscript', tags: ['apa', 'fmt'] },
    ],
  },
  {
    title: 'APA 6th Edition — References',
    items: [
      { text: 'References are arranged strictly alphabetically by first author’s surname', tags: ['apa'] },
      { text: 'No duplicate references appear in the reference list', tags: ['apa'] },
      { text: 'All in-text citations have a corresponding entry in the reference list', tags: ['apa'] },
      { text: 'All reference list entries have corresponding in-text citations', tags: ['apa'] },
      { text: 'Journal references include author(s), year, title, journal name, volume, issue, page numbers', tags: ['apa'] },
      { text: 'Web/government references include author/organization, year, title, URL, and access date', tags: ['apa'] },
      { text: '"et al." is correctly formatted — no period after "et", no capital letters', tags: ['apa', 'lang'] },
      { text: 'No comma between author name and year in in-text citations', tags: ['apa'] },
      { text: 'Multiple citations in one parenthetical are separated by semicolons', tags: ['apa'] },
      { text: 'Authors with 6 or fewer names are all listed in full in the reference list', tags: ['apa'] },
      { text: 'No invisible/special characters appear in citations', tags: ['apa', 'lang'] },
      { text: 'Documentation for all research follows APA 6th edition', tags: ['apa'] },
    ],
  },
  {
    title: 'Language, Grammar & Tense',
    items: [
      { text: 'Chapters 1 and 2 are written in present or future tense', tags: ['lang'] },
      { text: 'Chapters 3, 4, and 5 are written in past tense', tags: ['lang'] },
      { text: 'Tense is consistent within each chapter — no unintended mixing of past and future', tags: ['lang'] },
      { text: 'Subject-verb agreement is correct throughout', tags: ['lang'] },
      { text: 'No subjective or informal words appear in academic writing', tags: ['lang'] },
      { text: 'No stray sentence fragments or incomplete sentences', tags: ['lang'] },
      { text: 'Apostrophes are used correctly for possessives', tags: ['lang'] },
      { text: 'All parentheses and brackets are properly closed', tags: ['lang'] },
      { text: 'No duplicate consecutive citations appear in the text', tags: ['lang', 'apa'] },
      { text: 'No copy-paste artifacts are left in the text', tags: ['lang'] },
      { text: 'Factual claims about theories are accurate', tags: ['lang', 'content'] },
    ],
  },
]

function useLocalStorageState(key, initial) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return initial
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // ignore write failures
    }
  }, [key, state])

  return [state, setState]
}

export default function Checklist() {
  const [state, setState] = useLocalStorageState(STORAGE_KEY, {})
  const [filter, setFilter] = useState('all')
  const [openSections, setOpenSections] = useState(() => DATA.map(() => true))

  const filteredSections = useMemo(
    () =>
      DATA.map((section, sectionIndex) => {
        const items = section.items
          .map((item, itemIndex) => ({ ...item, itemIndex }))
          .filter((item) => (filter === 'all' ? true : item.tags.includes(filter)))
        return { ...section, sectionIndex, items }
      })
      .filter((section) => section.items.length),
    [filter],
  )

  const counts = useMemo(() => {
    let total = 0
    let done = 0
    DATA.forEach((section, sectionIndex) => {
      section.items.forEach((item, itemIndex) => {
        if (filter === 'all' || item.tags.includes(filter)) {
          total += 1
          if (state[`${sectionIndex}-${itemIndex}`]) done += 1
        }
      })
    })
    return { total, done }
  }, [filter, state])

  const toggleItem = (sectionIndex, itemIndex) => {
    const key = `${sectionIndex}-${itemIndex}`
    setState((previous) => ({ ...previous, [key]: !previous[key] }))
  }

  const resetChecklist = () => {
    setState({})
  }

  const toggleSection = (sectionIndex) => {
    setOpenSections((previous) =>
      previous.map((isOpen, index) => (index === sectionIndex ? !isOpen : isOpen)),
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-2">JRMSU Graduate School thesis checklist</p>
          <h2 className="text-2xl font-semibold text-slate-900">Checklist evaluator</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Track thesis compliance across formatting, required sections, APA style, language, content, and statistics.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="mb-2 text-sm text-slate-500">Progress</div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: counts.total ? `${Math.round((counts.done / counts.total) * 100)}%` : '0%' }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
              <span>{counts.done} done</span>
              <span>{counts.total} total</span>
            </div>
          </div>
          <button
            type="button"
            onClick={resetChecklist}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
          >
            Reset all
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              filter === item.key
                ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {filteredSections.map((section) => {
          const doneCount = section.items.reduce(
            (acc, item) => acc + (state[`${section.sectionIndex}-${item.itemIndex}`] ? 1 : 0),
            0,
          )
          const isOpen = openSections[section.sectionIndex]

          return (
            <section key={section.sectionIndex} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => toggleSection(section.sectionIndex)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div>
                  <div className="text-sm text-slate-500">{section.title}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {doneCount} / {section.items.length} completed
                  </div>
                </div>
                <div className={`text-xl text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </button>

              {isOpen && (
                <div className="divide-y divide-slate-200 px-5 py-4">
                  {section.items.map((item) => {
                    const key = `${section.sectionIndex}-${item.itemIndex}`
                    const checked = !!state[key]

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleItem(section.sectionIndex, item.itemIndex)}
                        className={`flex w-full items-start gap-4 px-3 py-4 text-left transition ${
                          checked ? 'bg-slate-50 opacity-80' : 'hover:bg-slate-50'
                        }`}
                      >
                        <span className={`mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-xl border ${
                          checked ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white'
                        }`}>
                          {checked ? '✓' : ''}
                        </span>
                        <div className="flex-1">
                          <div className={`text-sm leading-6 ${checked ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                            {item.text}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${TAG_STYLES[tag]}`}
                              >
                                {TAG_STYLES[tag] && tag.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
