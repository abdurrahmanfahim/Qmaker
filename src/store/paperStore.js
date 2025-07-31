import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const usePaperStore = create(
  persist(
    (set, get) => ({
      // Paper metadata
      metadata: {
        language: 'bangla',
        schoolName: '',
        examName: '',
        className: '',
        subject: '',
        book: '',
        fullMarks: '',
        duration: '',
        instructions: ''
      },

      // Sections array
      sections: [
        {
          id: uuidv4(),
          title: 'First Question',
          subQuestions: []
        }
      ],

      // UI state
      activeSectionId: null,
      activeSubQuestionId: null,
      previewMode: false,
      darkMode: false,

      // Actions
      setMetadata: (metadata) => set({ metadata }),
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

      // Section management
      addSection: () => {
        const getSectionTitle = (index, language = 'english') => {
          const ordinals = {
            english: ['First Question', 'Second Question', 'Third Question', 'Fourth Question', 'Fifth Question'],
            arabic: ['السؤال الأول', 'السؤال الثاني', 'السؤال الثالث', 'السؤال الرابع', 'السؤال الخامس'],
            bangla: ['প্রথম প্রশ্ন', 'দ্বিতীয় প্রশ্ন', 'তৃতীয় প্রশ্ন', 'চতুর্থ প্রশ্ন', 'পঞ্চম প্রশ্ন'],
            urdu: ['پہلا سوال', 'دوسرا سوال', 'تیسرا سوال', 'چوتھا سوال', 'پانچواں سوال']
          };
          return ordinals[language]?.[index] || `Section ${index + 1}`;
        };

        const newSection = {
          id: uuidv4(),
          title: getSectionTitle(get().sections.length),
          subQuestions: []
        };
        set(state => ({
          sections: [...state.sections, newSection],
          activeSectionId: newSection.id
        }));
      },

      deleteSection: (sectionId) => {
        set(state => {
          const newSections = state.sections.filter(s => s.id !== sectionId);
          return {
            sections: newSections,
            activeSectionId: newSections.length > 0 ? newSections[0].id : null
          };
        });
      },

      updateSection: (sectionId, updates) => {
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

      // Sub-question management
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
          marks: template?.marks || 5,
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

      updateSubQuestion: (sectionId, subQuestionId, updates) => {
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

      deleteSubQuestion: (sectionId, subQuestionId) => {
        set(state => ({
          sections: state.sections.map(s => 
            s.id === sectionId 
              ? {
                  ...s,
                  subQuestions: s.subQuestions.filter(sq => sq.id !== subQuestionId)
                }
              : s
          )
        }));
      },

      reorderSubQuestions: (sectionId, startIndex, endIndex) => {
        set(state => ({
          sections: state.sections.map(s => {
            if (s.id === sectionId) {
              const result = Array.from(s.subQuestions);
              const [removed] = result.splice(startIndex, 1);
              result.splice(endIndex, 0, removed);
              return { ...s, subQuestions: result };
            }
            return s;
          })
        }));
      },

      setActiveSubQuestion: (subQuestionId) => set({ activeSubQuestionId: subQuestionId }),

      // UI actions
      togglePreviewMode: () => set(state => ({ previewMode: !state.previewMode })),
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),

      // Data management
      exportData: () => {
        const state = get();
        return {
          metadata: state.metadata,
          sections: state.sections,
          exportDate: new Date().toISOString()
        };
      },

      importData: (data) => {
        set({
          metadata: data.metadata,
          sections: data.sections,
          activeSectionId: data.sections?.[0]?.id || null
        });
      },

      // Initialize
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