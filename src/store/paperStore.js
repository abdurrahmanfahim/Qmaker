/**
 * @fileoverview Core state management for Qmaker question paper builder
 * Handles paper metadata, sections, sub-questions, and UI state using Zustand
 * @author Qmaker Team
 * @version 1.0.0
 * @since 2024
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

/**
 * Main paper store using Zustand with persistence
 * Manages entire application state including metadata, sections, and UI state
 */
const usePaperStore = create(
  persist(
    (set, get) => ({
      // Undo/redo history management
      history: [], // Array of state snapshots for undo/redo
      historyIndex: -1, // Current position in history
      maxHistorySize: 50, // Maximum number of history states to keep
      // Paper metadata - exam information and settings
      metadata: {
        language: 'bangla', // Primary language for the paper (bangla, english, arabic, urdu)
        schoolName: '', // Institution name
        examName: '', // Exam title and year
        className: '', // Student class/grade
        subject: '', // Subject name
        book: '', // Textbook reference
        fullMarks: '', // Total marks for the exam
        duration: '', // Time allowed for exam
        instructions: '', // General exam instructions
        numberingStyle: 'letters' // Sub-question numbering style (letters, numbers, roman)
      },

      // Main content structure - array of question sections
      sections: [
        {
          id: uuidv4(), // Unique identifier for each section
          title: 'First Question', // Section heading
          subQuestions: [
            {
              id: uuidv4(),
              label: '(ক)',
              heading: '',
              content: '<p></p>',
              marks: '',
              showAnswer: false,
              answer: '',
              type: 'text'
            },
            {
              id: uuidv4(),
              label: '(খ)',
              heading: '',
              content: '<p></p>',
              marks: '',
              showAnswer: false,
              answer: '',
              type: 'text'
            },
            {
              id: uuidv4(),
              label: '(গ)',
              heading: '',
              content: '<p></p>',
              marks: '',
              showAnswer: false,
              answer: '',
              type: 'text'
            }
          ] // Array of sub-questions within this section
        }
      ],

      // UI state management
      activeSectionId: null, // Currently selected section ID
      activeSubQuestionId: null, // Currently selected sub-question ID
      previewMode: false, // Toggle between edit and preview modes
      darkMode: false, // Dark/light theme toggle
      
      /**
       * Save current state to history for undo/redo functionality
       * Creates a deep copy snapshot of metadata and sections
       */
      saveToHistory: () => {
        const state = get();
        const snapshot = {
          metadata: { ...state.metadata },
          sections: JSON.parse(JSON.stringify(state.sections)),
          timestamp: Date.now()
        };
        
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(snapshot);
        
        if (newHistory.length > state.maxHistorySize) {
          newHistory.shift();
        }
        
        set({ 
          history: newHistory, 
          historyIndex: newHistory.length - 1 
        });
      },
      
      /**
       * Undo last action by restoring previous state from history
       */
      undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
          const prevState = state.history[state.historyIndex - 1];
          set({
            metadata: prevState.metadata,
            sections: prevState.sections,
            historyIndex: state.historyIndex - 1
          });
        }
      },
      
      /**
       * Redo previously undone action by moving forward in history
       */
      redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
          const nextState = state.history[state.historyIndex + 1];
          set({
            metadata: nextState.metadata,
            sections: nextState.sections,
            historyIndex: state.historyIndex + 1
          });
        }
      },
      
      /** Check if undo is available */
      canUndo: () => get().historyIndex > 0,
      /** Check if redo is available */
      canRedo: () => get().historyIndex < get().history.length - 1,

      /**
       * Update paper metadata (exam info, settings)
       * @param {Object} metadata - Updated metadata object
       */
      setMetadata: (metadata) => {
        set({ metadata });
      },
      /**
       * Change paper language and update all section titles and sub-question labels
       * @param {string} language - Target language (english, bangla, arabic, urdu)
       */
      setLanguage: (language) => {
        set(state => {
          const getSectionTitle = (index, lang) => {
            const ordinals = {
              english: ['First Question', 'Second Question', 'Third Question', 'Fourth Question', 'Fifth Question'],
              arabic: ['السؤال الأول', 'السؤال الثاني', 'السؤال الثالث', 'السؤال الرابع', 'السؤال الخامس'],
              bangla: ['প্রথম প্রশ্ন', 'দ্বিতীয় প্রশ্ন', 'তৃতীয় প্রশ্ন', 'চতুর্থ প্রশ্ন', 'পঞ্চম প্রশ্ন'],
              urdu: ['پہلا سوال', 'دوسرا سوال', 'تیسرا سوال', 'چوتھا سوال', 'پانچواں سوال']
            };
            return ordinals[lang]?.[index] || `Section ${index + 1}`;
          };

          const getLabel = (idx, lang) => {
            if (lang === 'arabic') {
              const arabicLetters = ['أ', 'ب', 'ج', 'د', 'ه'];
              return `(${arabicLetters[idx] || 'أ'})`;
            }
            if (lang === 'bangla') return `(${String.fromCharCode(2453 + idx)})`;
            if (lang === 'urdu') return `(${String.fromCharCode(1575 + idx)})`;
            return `(${String.fromCharCode(97 + idx)})`;
          };

          const updatedSections = state.sections.map((section, sectionIndex) => ({
            ...section,
            title: getSectionTitle(sectionIndex, language),
            subQuestions: section.subQuestions.map((sq, sqIndex) => ({
              ...sq,
              label: getLabel(sqIndex, language)
            }))
          }));

          return {
            metadata: { ...state.metadata, language },
            sections: updatedSections
          };
        });
      },

      /**
       * Add new section to the paper with localized title
       * Automatically sets the new section as active
       */
      addSection: () => {
        const getSectionTitle = (index, language) => {
          const ordinals = {
            english: ['First Question', 'Second Question', 'Third Question', 'Fourth Question', 'Fifth Question'],
            arabic: ['السؤال الأول', 'السؤال الثاني', 'السؤال الثالث', 'السؤال الرابع', 'السؤال الخامس'],
            bangla: ['প্রথম প্রশ্ন', 'দ্বিতীয় প্রশ্ন', 'তৃতীয় প্রশ্ন', 'চতুর্থ প্রশ্ন', 'পঞ্চম প্রশ্ন'],
            urdu: ['پہلا سوال', 'دوسرا سوال', 'تیسرا سوال', 'چوتھا سوال', 'پانچواں سوال']
          };
          return ordinals[language]?.[index] || `Section ${index + 1}`;
        };

        const currentLanguage = get().metadata.language;
        const newSection = {
          id: uuidv4(),
          title: getSectionTitle(get().sections.length, currentLanguage),
          subQuestions: []
        };
        
        const getLabel = (index, language) => {
          if (language === 'arabic') {
            const arabicLetters = ['أ', 'ب', 'ج', 'د', 'ه'];
            return `(${arabicLetters[index] || 'أ'})`;
          }
          if (language === 'bangla') return `(${String.fromCharCode(2453 + index)})`;
          if (language === 'urdu') return `(${String.fromCharCode(1575 + index)})`;
          return `(${String.fromCharCode(97 + index)})`;
        };
        
        const defaultSubQuestions = [
          {
            id: uuidv4(),
            label: getLabel(0, currentLanguage),
            heading: '',
            content: '<p></p>',
            marks: '',
            showAnswer: false,
            answer: '',
            type: 'text'
          },
          {
            id: uuidv4(),
            label: getLabel(1, currentLanguage),
            heading: '',
            content: '<p></p>',
            marks: '',
            showAnswer: false,
            answer: '',
            type: 'text'
          },
          {
            id: uuidv4(),
            label: getLabel(2, currentLanguage),
            heading: '',
            content: '<p></p>',
            marks: '',
            showAnswer: false,
            answer: '',
            type: 'text'
          }
        ];
        
        newSection.subQuestions = defaultSubQuestions;
        
        set(state => ({
          sections: [...state.sections, newSection],
          activeSectionId: newSection.id,
          activeSubQuestionId: defaultSubQuestions[0].id
        }));
      },

      /**
       * Delete section by ID and update active section
       * @param {string} sectionId - ID of section to delete
       */
      deleteSection: (sectionId) => {
        set(state => {
          const newSections = state.sections.filter(s => s.id !== sectionId);
          return {
            sections: newSections,
            activeSectionId: newSections.length > 0 ? newSections[0].id : null
          };
        });
      },

      /**
       * Update section properties (title, instructions, etc.)
       * @param {string} sectionId - ID of section to update
       * @param {Object} updates - Properties to update
       */
      updateSection: (sectionId, updates) => {
        // Only save to history for text content changes
        if (updates.title) {
          get().saveToHistory();
        }
        set(state => ({
          sections: state.sections.map(s => 
            s.id === sectionId ? { ...s, ...updates } : s
          )
        }));
      },

      reorderSections: (startIndex, endIndex) => {
        set(state => {
          const result = Array.from(state.sections);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { sections: result };
        });
      },

      setActiveSection: (sectionId) => set({ activeSectionId: sectionId }),

      /**
       * Add new sub-question to a section with optional template
       * @param {string} sectionId - Target section ID
       * @param {Object|null} template - Optional template with predefined content
       */
      addSubQuestion: (sectionId, template = null) => {
        const section = get().sections.find(s => s.id === sectionId);
        if (!section) return;

        const getLabel = (index, language) => {
          if (language === 'arabic') {
            const arabicLetters = ['أ', 'ب', 'ج', 'د', 'ه'];
            return `(${arabicLetters[index] || 'أ'})`;
          }
          if (language === 'bangla') return `(${String.fromCharCode(2453 + index)})`; // (ক)
          if (language === 'urdu') return `(${String.fromCharCode(1575 + index)})`; // (ا)
          return `(${String.fromCharCode(97 + index)})`; // (a)
        };

        const newSubQuestion = {
          id: uuidv4(),
          label: getLabel(section.subQuestions.length, get().metadata.language),
          heading: template?.heading || '',
          content: template?.content || '',
          marks: template?.marks || '',
          showAnswer: false,
          answer: template?.answer || '',
          type: template?.type || 'text'
        };

        set(state => ({
          sections: state.sections.map(s => 
            s.id === sectionId 
              ? { ...s, subQuestions: [...s.subQuestions, newSubQuestion] }
              : s
          ),
          activeSubQuestionId: newSubQuestion.id
        }));
      },

      /**
       * Update sub-question properties (content, marks, etc.)
       * @param {string} sectionId - Parent section ID
       * @param {string} subQuestionId - Sub-question ID to update
       * @param {Object} updates - Properties to update
       */
      updateSubQuestion: (sectionId, subQuestionId, updates) => {
        // Only save to history for text content changes
        if (updates.content || updates.heading) {
          get().saveToHistory();
        }
        set(state => ({
          sections: state.sections.map(s => 
            s.id === sectionId 
              ? {
                  ...s,
                  subQuestions: s.subQuestions.map(sq => 
                    sq.id === subQuestionId ? { ...sq, ...updates } : sq
                  )
                }
              : s
          )
        }));
      },

      /**
       * Delete sub-question from section and re-label remaining ones
       * @param {string} sectionId - Parent section ID
       * @param {string} subQuestionId - Sub-question ID to delete
       */
      deleteSubQuestion: (sectionId, subQuestionId) => {
        const getLabel = (index, language) => {
          if (language === 'arabic') {
            const arabicLetters = ['أ', 'ب', 'ج', 'د', 'ه'];
            return `(${arabicLetters[index] || 'أ'})`;
          }
          if (language === 'bangla') return `(${String.fromCharCode(2453 + index)})`;
          if (language === 'urdu') return `(${String.fromCharCode(1575 + index)})`;
          return `(${String.fromCharCode(97 + index)})`;
        };

        set(state => ({
          sections: state.sections.map(s => 
            s.id === sectionId 
              ? {
                  ...s,
                  subQuestions: s.subQuestions
                    .filter(sq => sq.id !== subQuestionId)
                    .map((sq, index) => ({
                      ...sq,
                      label: getLabel(index, state.metadata.language)
                    }))
                }
              : s
          )
        }));
      },

      reorderSubQuestions: (sectionId, startIndex, endIndex) => {
        const getLabel = (index, language) => {
          if (language === 'arabic') {
            const arabicLetters = ['أ', 'ب', 'ج', 'د', 'ه'];
            return `(${arabicLetters[index] || 'أ'})`;
          }
          if (language === 'bangla') return `(${String.fromCharCode(2453 + index)})`;
          if (language === 'urdu') return `(${String.fromCharCode(1575 + index)})`;
          return `(${String.fromCharCode(97 + index)})`;
        };

        set(state => ({
          sections: state.sections.map(s => {
            if (s.id === sectionId) {
              const result = Array.from(s.subQuestions);
              const [removed] = result.splice(startIndex, 1);
              result.splice(endIndex, 0, removed);
              return { 
                ...s, 
                subQuestions: result.map((sq, index) => ({
                  ...sq,
                  label: getLabel(index, state.metadata.language)
                }))
              };
            }
            return s;
          })
        }));
      },

      setActiveSubQuestion: (subQuestionId) => set({ activeSubQuestionId: subQuestionId }),

      /** Toggle between edit and preview modes */
      togglePreviewMode: () => set(state => ({ previewMode: !state.previewMode })),
      /** Toggle dark/light theme */
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),

      /**
       * Export current paper data for backup/sharing
       * @returns {Object} Complete paper data with timestamp
       */
      exportData: () => {
        const state = get();
        return {
          metadata: state.metadata,
          sections: state.sections,
          exportDate: new Date().toISOString()
        };
      },

      /**
       * Import paper data from backup/shared file
       * @param {Object} data - Paper data to import
       */
      importData: (data) => {
        set({
          metadata: data.metadata,
          sections: data.sections,
          activeSectionId: data.sections?.[0]?.id || null
        });
      },

      /**
       * Clear all data for new paper
       */
      clearAll: () => {
        const defaultSection = {
          id: uuidv4(),
          title: 'First Question',
          subQuestions: [
            {
              id: uuidv4(),
              label: '(ক)',
              heading: '',
              content: '<p></p>',
              marks: '',
              showAnswer: false,
              answer: '',
              type: 'text'
            },
            {
              id: uuidv4(),
              label: '(খ)',
              heading: '',
              content: '<p></p>',
              marks: '',
              showAnswer: false,
              answer: '',
              type: 'text'
            },
            {
              id: uuidv4(),
              label: '(গ)',
              heading: '',
              content: '<p></p>',
              marks: '',
              showAnswer: false,
              answer: '',
              type: 'text'
            }
          ]
        };
        
        set({
          metadata: {
            language: 'bangla',
            schoolName: '',
            examName: '',
            className: '',
            subject: '',
            book: '',
            fullMarks: '',
            duration: '',
            instructions: '',
            numberingStyle: 'letters'
          },
          sections: [defaultSection],
          activeSectionId: defaultSection.id,
          activeSubQuestionId: defaultSection.subQuestions[0].id,
          previewMode: false
        });
      },

      /**
       * Initialize store on app startup
       * Sets first section as active if none selected
       */
      initialize: () => {
        const state = get();
        if (state.sections.length > 0 && !state.activeSectionId) {
          set({ activeSectionId: state.sections[0].id });
        }
      }
    }),
    {
      name: 'paper-storage',
      partialize: (state) => ({
        metadata: state.metadata,
        sections: state.sections,
        darkMode: state.darkMode
      })
    }
  )
);

export default usePaperStore;