# 🏗️ Qmaker OOP Architecture & Google Drive-like File System

## 📋 Executive Summary

This document redesigns Qmaker using **Object-Oriented Programming principles** with a **Google Drive-inspired file system** and **Google Docs-like collaborative editing**. The architecture prioritizes scalability, maintainability, and user experience.

---

## 🎯 OOP Design Principles Applied

### **1. Single Responsibility Principle (SRP)**

Each class has one reason to change and one primary responsibility.

### **2. Open/Closed Principle (OCP)**

Classes are open for extension but closed for modification.

### **3. Liskov Substitution Principle (LSP)**

Derived classes must be substitutable for their base classes.

### **4. Interface Segregation Principle (ISP)**

Clients should not depend on interfaces they don't use.

### **5. Dependency Inversion Principle (DIP)**

Depend on abstractions, not concretions.

---

## 🏛️ Core OOP Architecture

### **Base Classes & Interfaces**

```typescript
// Base Entity Class
abstract class Entity {
  protected id: string;
  protected createdAt: Date;
  protected updatedAt: Date;
  protected owner: User;

  constructor(id: string, owner: User) {
    this.id = id;
    this.owner = owner;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  abstract validate(): boolean;
  abstract serialize(): object;
  abstract clone(): Entity;

  getId(): string {
    return this.id;
  }
  getOwner(): User {
    return this.owner;
  }
  touch(): void {
    this.updatedAt = new Date();
  }
}

// Shareable Interface
interface Shareable {
  share(user: User, permission: Permission): void;
  unshare(user: User): void;
  getPermissions(): Map<User, Permission>;
  canAccess(user: User, action: Action): boolean;
}

// Versionable Interface
interface Versionable {
  createVersion(): Version;
  getVersions(): Version[];
  restoreVersion(versionId: string): void;
  compareVersions(v1: string, v2: string): Diff[];
}

// Searchable Interface
interface Searchable {
  getSearchableContent(): string;
  getSearchMetadata(): SearchMetadata;
  matchesQuery(query: SearchQuery): boolean;
}
```

---

## 📁 File System Architecture (Google Drive-like)

### **File System Core Classes**

```typescript
// Base File System Item
abstract class FileSystemItem extends Entity implements Shareable, Searchable {
  protected name: string;
  protected parent: Folder | null;
  protected path: string;
  protected permissions: Map<User, Permission>;
  protected tags: Tag[];
  protected starred: boolean;

  constructor(id: string, name: string, owner: User, parent?: Folder) {
    super(id, owner);
    this.name = name;
    this.parent = parent || null;
    this.path = this.calculatePath();
    this.permissions = new Map();
    this.tags = [];
    this.starred = false;
  }

  // Shareable implementation
  share(user: User, permission: Permission): void {
    this.permissions.set(user, permission);
    this.touch();
  }

  unshare(user: User): void {
    this.permissions.delete(user);
    this.touch();
  }

  canAccess(user: User, action: Action): boolean {
    if (this.owner === user) return true;
    const permission = this.permissions.get(user);
    return permission?.allows(action) || false;
  }

  // Navigation methods
  move(newParent: Folder): void {
    this.parent = newParent;
    this.path = this.calculatePath();
    this.touch();
  }

  rename(newName: string): void {
    this.name = newName;
    this.path = this.calculatePath();
    this.touch();
  }

  private calculatePath(): string {
    if (!this.parent) return `/${this.name}`;
    return `${this.parent.getPath()}/${this.name}`;
  }

  // Getters
  getName(): string {
    return this.name;
  }
  getPath(): string {
    return this.path;
  }
  getParent(): Folder | null {
    return this.parent;
  }
  isStarred(): boolean {
    return this.starred;
  }

  // Abstract methods
  abstract getSize(): number;
  abstract getType(): FileType;
}

// Folder Class
class Folder extends FileSystemItem {
  private children: Map<string, FileSystemItem>;
  private viewSettings: FolderViewSettings;

  constructor(id: string, name: string, owner: User, parent?: Folder) {
    super(id, name, owner, parent);
    this.children = new Map();
    this.viewSettings = new FolderViewSettings();
  }

  // Folder operations
  addChild(item: FileSystemItem): void {
    this.children.set(item.getId(), item);
    item.move(this);
    this.touch();
  }

  removeChild(itemId: string): void {
    this.children.delete(itemId);
    this.touch();
  }

  getChildren(): FileSystemItem[] {
    return Array.from(this.children.values());
  }

  findChild(name: string): FileSystemItem | null {
    return (
      Array.from(this.children.values()).find(
        (child) => child.getName() === name
      ) || null
    );
  }

  // Search within folder
  search(query: SearchQuery): FileSystemItem[] {
    const results: FileSystemItem[] = [];

    for (const child of this.children.values()) {
      if (child.matchesQuery(query)) {
        results.push(child);
      }

      if (child instanceof Folder) {
        results.push(...child.search(query));
      }
    }

    return results;
  }

  getSize(): number {
    return Array.from(this.children.values()).reduce(
      (total, child) => total + child.getSize(),
      0
    );
  }

  getType(): FileType {
    return FileType.FOLDER;
  }

  validate(): boolean {
    return this.name.length > 0 && this.name.length <= 255;
  }

  serialize(): object {
    return {
      id: this.id,
      name: this.name,
      type: "folder",
      path: this.path,
      children: Array.from(this.children.keys()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  clone(): Folder {
    const cloned = new Folder(
      generateId(),
      `${this.name} (Copy)`,
      this.owner,
      this.parent
    );

    // Clone children
    for (const child of this.children.values()) {
      cloned.addChild(child.clone());
    }

    return cloned;
  }

  getSearchableContent(): string {
    return this.name;
  }

  getSearchMetadata(): SearchMetadata {
    return {
      type: "folder",
      name: this.name,
      path: this.path,
      tags: this.tags,
      childCount: this.children.size,
    };
  }

  matchesQuery(query: SearchQuery): boolean {
    return (
      query.matches(this.name) ||
      this.tags.some((tag) => query.matches(tag.name))
    );
  }
}

// Question Paper File Class
class QuestionPaper extends FileSystemItem implements Versionable {
  private content: PaperContent;
  private versions: Version[];
  private collaborators: Map<User, CollaborationSession>;
  private template: Template | null;

  constructor(id: string, name: string, owner: User, parent?: Folder) {
    super(id, name, owner, parent);
    this.content = new PaperContent();
    this.versions = [];
    this.collaborators = new Map();
    this.template = null;
  }

  // Content management
  getContent(): PaperContent {
    return this.content;
  }

  updateContent(newContent: PaperContent): void {
    this.content = newContent;
    this.touch();
    this.notifyCollaborators("content_updated");
  }

  // Collaboration
  addCollaborator(user: User): CollaborationSession {
    const session = new CollaborationSession(user, this);
    this.collaborators.set(user, session);
    return session;
  }

  removeCollaborator(user: User): void {
    this.collaborators.delete(user);
  }

  getActiveCollaborators(): User[] {
    return Array.from(this.collaborators.keys()).filter((user) =>
      this.collaborators.get(user)?.isActive()
    );
  }

  private notifyCollaborators(event: string): void {
    for (const session of this.collaborators.values()) {
      session.notify(event, this.content);
    }
  }

  // Versioning
  createVersion(): Version {
    const version = new Version(
      generateId(),
      this.content.clone(),
      this.owner,
      `Version ${this.versions.length + 1}`
    );
    this.versions.push(version);
    return version;
  }

  getVersions(): Version[] {
    return [...this.versions];
  }

  restoreVersion(versionId: string): void {
    const version = this.versions.find((v) => v.getId() === versionId);
    if (version) {
      this.content = version.getContent().clone();
      this.touch();
      this.notifyCollaborators("version_restored");
    }
  }

  compareVersions(v1: string, v2: string): Diff[] {
    const version1 = this.versions.find((v) => v.getId() === v1);
    const version2 = this.versions.find((v) => v.getId() === v2);

    if (version1 && version2) {
      return DiffEngine.compare(version1.getContent(), version2.getContent());
    }

    return [];
  }

  // Template management
  applyTemplate(template: Template): void {
    this.template = template;
    this.content = template.generateContent();
    this.touch();
  }

  saveAsTemplate(name: string): Template {
    return new Template(generateId(), name, this.content.clone(), this.owner);
  }

  getSize(): number {
    return JSON.stringify(this.content.serialize()).length;
  }

  getType(): FileType {
    return FileType.QUESTION_PAPER;
  }

  validate(): boolean {
    return this.name.length > 0 && this.content.validate();
  }

  serialize(): object {
    return {
      id: this.id,
      name: this.name,
      type: "question_paper",
      path: this.path,
      content: this.content.serialize(),
      template: this.template?.getId(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      collaborators: Array.from(this.collaborators.keys()).map((u) =>
        u.getId()
      ),
    };
  }

  clone(): QuestionPaper {
    const cloned = new QuestionPaper(
      generateId(),
      `${this.name} (Copy)`,
      this.owner,
      this.parent
    );
    cloned.content = this.content.clone();
    return cloned;
  }

  getSearchableContent(): string {
    return `${this.name} ${this.content.getSearchableText()}`;
  }

  getSearchMetadata(): SearchMetadata {
    return {
      type: "question_paper",
      name: this.name,
      path: this.path,
      tags: this.tags,
      language: this.content.getLanguage(),
      subject: this.content.getSubject(),
      questionCount: this.content.getQuestionCount(),
    };
  }

  matchesQuery(query: SearchQuery): boolean {
    return (
      query.matches(this.name) ||
      query.matches(this.content.getSearchableText()) ||
      this.tags.some((tag) => query.matches(tag.name))
    );
  }
}
```

---

## 📝 Content Management (Google Docs-like)

### **Paper Content Architecture**

```typescript
// Paper Content Class
class PaperContent {
  private metadata: PaperMetadata;
  private sections: Section[];
  private language: Language;
  private theme: Theme;

  constructor() {
    this.metadata = new PaperMetadata();
    this.sections = [];
    this.language = Language.ENGLISH;
    this.theme = Theme.DEFAULT;
  }

  // Section management
  addSection(section: Section): void {
    this.sections.push(section);
    this.updateSectionNumbers();
  }

  removeSection(sectionId: string): void {
    this.sections = this.sections.filter((s) => s.getId() !== sectionId);
    this.updateSectionNumbers();
  }

  moveSection(fromIndex: number, toIndex: number): void {
    const section = this.sections.splice(fromIndex, 1)[0];
    this.sections.splice(toIndex, 0, section);
    this.updateSectionNumbers();
  }

  private updateSectionNumbers(): void {
    this.sections.forEach((section, index) => {
      section.setNumber(index + 1);
    });
  }

  // Content operations
  getSearchableText(): string {
    return this.sections
      .map((section) => section.getSearchableText())
      .join(" ");
  }

  getQuestionCount(): number {
    return this.sections.reduce(
      (total, section) => total + section.getQuestionCount(),
      0
    );
  }

  getTotalMarks(): number {
    return this.sections.reduce(
      (total, section) => total + section.getTotalMarks(),
      0
    );
  }

  // Language and formatting
  setLanguage(language: Language): void {
    this.language = language;
    this.sections.forEach((section) => section.setLanguage(language));
  }

  getLanguage(): Language {
    return this.language;
  }
  getSubject(): string {
    return this.metadata.subject;
  }

  validate(): boolean {
    return (
      this.metadata.validate() &&
      this.sections.every((section) => section.validate())
    );
  }

  serialize(): object {
    return {
      metadata: this.metadata.serialize(),
      sections: this.sections.map((s) => s.serialize()),
      language: this.language,
      theme: this.theme,
    };
  }

  clone(): PaperContent {
    const cloned = new PaperContent();
    cloned.metadata = this.metadata.clone();
    cloned.sections = this.sections.map((s) => s.clone());
    cloned.language = this.language;
    cloned.theme = this.theme;
    return cloned;
  }
}

// Section Class
class Section {
  private id: string;
  private title: string;
  private number: number;
  private questions: Question[];
  private instructions: string;
  private language: Language;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
    this.number = 1;
    this.questions = [];
    this.instructions = "";
    this.language = Language.ENGLISH;
  }

  // Question management
  addQuestion(question: Question): void {
    this.questions.push(question);
    this.updateQuestionLabels();
  }

  removeQuestion(questionId: string): void {
    this.questions = this.questions.filter((q) => q.getId() !== questionId);
    this.updateQuestionLabels();
  }

  private updateQuestionLabels(): void {
    this.questions.forEach((question, index) => {
      const label = this.generateQuestionLabel(index);
      question.setLabel(label);
    });
  }

  private generateQuestionLabel(index: number): string {
    const labelGenerators = {
      [Language.ENGLISH]: (i: number) => `(${String.fromCharCode(97 + i)})`,
      [Language.ARABIC]: (i: number) =>
        `(${
          [
            "أ",
            "ب",
            "ج",
            "د",
            "ه",
            "و",
            "ز",
            "ح",
            "ط",
            "ي",
            "ك",
            "ل",
            "م",
            "ن",
            "س",
            "ع",
            "ف",
            "ص",
            "ق",
            "ر",
            "ش",
            "ت",
            "ث",
            "خ",
            "ذ",
            "ض",
            "ظ",
            "غ",
          ][i] || "أ"
        })`,
      [Language.BANGLA]: (i: number) => `(${String.fromCharCode(2453 + i)})`,
      [Language.URDU]: (i: number) => `(${String.fromCharCode(1575 + i)})`,
    };

    return labelGenerators[this.language](index);
  }

  // Content operations
  getSearchableText(): string {
    return `${this.title} ${this.instructions} ${this.questions
      .map((q) => q.getSearchableText())
      .join(" ")}`;
  }

  getQuestionCount(): number {
    return this.questions.length;
  }

  getTotalMarks(): number {
    return this.questions.reduce((total, q) => total + q.getMarks(), 0);
  }

  setLanguage(language: Language): void {
    this.language = language;
    this.updateQuestionLabels();
  }

  setNumber(number: number): void {
    this.number = number;
  }
  getId(): string {
    return this.id;
  }

  validate(): boolean {
    return this.title.length > 0 && this.questions.every((q) => q.validate());
  }

  serialize(): object {
    return {
      id: this.id,
      title: this.title,
      number: this.number,
      questions: this.questions.map((q) => q.serialize()),
      instructions: this.instructions,
      language: this.language,
    };
  }

  clone(): Section {
    const cloned = new Section(generateId(), this.title);
    cloned.number = this.number;
    cloned.questions = this.questions.map((q) => q.clone());
    cloned.instructions = this.instructions;
    cloned.language = this.language;
    return cloned;
  }
}

// Question Class
class Question {
  private id: string;
  private label: string;
  private content: RichTextContent;
  private answer: RichTextContent;
  private marks: number;
  private type: QuestionType;
  private showAnswer: boolean;

  constructor(id: string, type: QuestionType) {
    this.id = id;
    this.label = "(a)";
    this.content = new RichTextContent();
    this.answer = new RichTextContent();
    this.marks = 0;
    this.type = type;
    this.showAnswer = false;
  }

  // Content management
  setContent(content: RichTextContent): void {
    this.content = content;
  }

  setAnswer(answer: RichTextContent): void {
    this.answer = answer;
  }

  setLabel(label: string): void {
    this.label = label;
  }
  setMarks(marks: number): void {
    this.marks = marks;
  }

  // Getters
  getId(): string {
    return this.id;
  }
  getContent(): RichTextContent {
    return this.content;
  }
  getAnswer(): RichTextContent {
    return this.answer;
  }
  getMarks(): number {
    return this.marks;
  }
  getType(): QuestionType {
    return this.type;
  }

  getSearchableText(): string {
    return `${this.content.getPlainText()} ${this.answer.getPlainText()}`;
  }

  validate(): boolean {
    return this.content.validate() && this.marks >= 0;
  }

  serialize(): object {
    return {
      id: this.id,
      label: this.label,
      content: this.content.serialize(),
      answer: this.answer.serialize(),
      marks: this.marks,
      type: this.type,
      showAnswer: this.showAnswer,
    };
  }

  clone(): Question {
    const cloned = new Question(generateId(), this.type);
    cloned.label = this.label;
    cloned.content = this.content.clone();
    cloned.answer = this.answer.clone();
    cloned.marks = this.marks;
    cloned.showAnswer = this.showAnswer;
    return cloned;
  }
}
```

---

## 🔄 File System Manager (Google Drive-like Operations)

### **File System Manager Class**

```typescript
class FileSystemManager {
  private rootFolder: Folder;
  private currentUser: User;
  private searchIndex: SearchIndex;
  private recentItems: RecentItemsManager;
  private trashBin: TrashBin;

  constructor(user: User) {
    this.currentUser = user;
    this.rootFolder = new Folder("root", "My Drive", user);
    this.searchIndex = new SearchIndex();
    this.recentItems = new RecentItemsManager();
    this.trashBin = new TrashBin();
  }

  // Folder operations
  createFolder(name: string, parent?: Folder): Folder {
    const parentFolder = parent || this.rootFolder;
    const folder = new Folder(
      generateId(),
      name,
      this.currentUser,
      parentFolder
    );
    parentFolder.addChild(folder);
    this.searchIndex.addItem(folder);
    return folder;
  }

  createQuestionPaper(name: string, parent?: Folder): QuestionPaper {
    const parentFolder = parent || this.rootFolder;
    const paper = new QuestionPaper(
      generateId(),
      name,
      this.currentUser,
      parentFolder
    );
    parentFolder.addChild(paper);
    this.searchIndex.addItem(paper);
    this.recentItems.addItem(paper);
    return paper;
  }

  // File operations
  moveItem(item: FileSystemItem, newParent: Folder): void {
    const oldParent = item.getParent();
    if (oldParent) {
      oldParent.removeChild(item.getId());
    }
    newParent.addChild(item);
    this.searchIndex.updateItem(item);
  }

  copyItem(item: FileSystemItem, newParent: Folder): FileSystemItem {
    const copy = item.clone();
    newParent.addChild(copy);
    this.searchIndex.addItem(copy);
    return copy;
  }

  deleteItem(item: FileSystemItem): void {
    const parent = item.getParent();
    if (parent) {
      parent.removeChild(item.getId());
    }
    this.trashBin.addItem(item);
    this.searchIndex.removeItem(item);
  }

  restoreItem(itemId: string): void {
    const item = this.trashBin.getItem(itemId);
    if (item) {
      this.rootFolder.addChild(item);
      this.trashBin.removeItem(itemId);
      this.searchIndex.addItem(item);
    }
  }

  // Search operations
  search(query: string): SearchResult[] {
    const searchQuery = new SearchQuery(query);
    return this.searchIndex.search(searchQuery);
  }

  getRecentItems(): FileSystemItem[] {
    return this.recentItems.getItems();
  }

  getStarredItems(): FileSystemItem[] {
    return this.searchIndex.getStarredItems();
  }

  getSharedWithMe(): FileSystemItem[] {
    return this.searchIndex.getSharedItems(this.currentUser);
  }

  // Navigation
  navigateToPath(path: string): Folder | null {
    const parts = path.split("/").filter((p) => p.length > 0);
    let current: Folder = this.rootFolder;

    for (const part of parts) {
      const child = current.findChild(part);
      if (child instanceof Folder) {
        current = child;
      } else {
        return null;
      }
    }

    return current;
  }

  getBreadcrumb(item: FileSystemItem): BreadcrumbItem[] {
    const breadcrumb: BreadcrumbItem[] = [];
    let current: FileSystemItem | null = item;

    while (current) {
      breadcrumb.unshift({
        id: current.getId(),
        name: current.getName(),
        path: current.getPath(),
      });
      current = current.getParent();
    }

    return breadcrumb;
  }
}
```

---

## 🎨 UI Component Architecture (OOP-based)

### **Base UI Components**

```typescript
// Base UI Component
abstract class UIComponent {
  protected element: HTMLElement;
  protected props: ComponentProps;
  protected state: ComponentState;
  protected children: UIComponent[];

  constructor(props: ComponentProps) {
    this.props = props;
    this.state = {};
    this.children = [];
    this.element = this.createElement();
    this.bindEvents();
  }

  abstract createElement(): HTMLElement;
  abstract render(): void;

  protected bindEvents(): void {
    // Override in subclasses
  }

  setState(newState: Partial<ComponentState>): void {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  addChild(child: UIComponent): void {
    this.children.push(child);
    this.element.appendChild(child.getElement());
  }

  removeChild(child: UIComponent): void {
    this.children = this.children.filter((c) => c !== child);
    this.element.removeChild(child.getElement());
  }

  getElement(): HTMLElement {
    return this.element;
  }
  destroy(): void {
    this.children.forEach((child) => child.destroy());
    this.element.remove();
  }
}

// File Explorer Component
class FileExplorer extends UIComponent {
  private fileManager: FileSystemManager;
  private currentFolder: Folder;
  private viewMode: ViewMode;

  constructor(props: FileExplorerProps) {
    super(props);
    this.fileManager = props.fileManager;
    this.currentFolder =
      props.initialFolder || this.fileManager.getRootFolder();
    this.viewMode = ViewMode.GRID;
  }

  createElement(): HTMLElement {
    const container = document.createElement("div");
    container.className = "file-explorer";
    return container;
  }

  render(): void {
    this.element.innerHTML = "";

    // Breadcrumb
    const breadcrumb = new Breadcrumb({
      items: this.fileManager.getBreadcrumb(this.currentFolder),
      onNavigate: (path: string) => this.navigateToPath(path),
    });
    this.addChild(breadcrumb);

    // Toolbar
    const toolbar = new FileToolbar({
      viewMode: this.viewMode,
      onViewModeChange: (mode: ViewMode) => this.setViewMode(mode),
      onCreateFolder: () => this.createFolder(),
      onCreatePaper: () => this.createPaper(),
    });
    this.addChild(toolbar);

    // File Grid/List
    const fileView =
      this.viewMode === ViewMode.GRID
        ? new FileGrid({
            items: this.currentFolder.getChildren(),
            onItemClick: (item: FileSystemItem) => this.handleItemClick(item),
            onItemContextMenu: (item: FileSystemItem) =>
              this.showContextMenu(item),
          })
        : new FileList({
            items: this.currentFolder.getChildren(),
            onItemClick: (item: FileSystemItem) => this.handleItemClick(item),
          });

    this.addChild(fileView);
  }

  private navigateToPath(path: string): void {
    const folder = this.fileManager.navigateToPath(path);
    if (folder) {
      this.currentFolder = folder;
      this.render();
    }
  }

  private setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    this.render();
  }

  private handleItemClick(item: FileSystemItem): void {
    if (item instanceof Folder) {
      this.currentFolder = item;
      this.render();
    } else if (item instanceof QuestionPaper) {
      this.openPaper(item);
    }
  }

  private openPaper(paper: QuestionPaper): void {
    const editor = new PaperEditor({ paper });
    // Open in new view/modal
  }

  private createFolder(): void {
    const name = prompt("Folder name:");
    if (name) {
      this.fileManager.createFolder(name, this.currentFolder);
      this.render();
    }
  }

  private createPaper(): void {
    const name = prompt("Paper name:");
    if (name) {
      const paper = this.fileManager.createQuestionPaper(
        name,
        this.currentFolder
      );
      this.openPaper(paper);
    }
  }
}

// Paper Editor Component (Google Docs-like)
class PaperEditor extends UIComponent {
  private paper: QuestionPaper;
  private collaborationManager: CollaborationManager;
  private toolbar: EditorToolbar;
  private contentArea: ContentArea;

  constructor(props: PaperEditorProps) {
    super(props);
    this.paper = props.paper;
    this.collaborationManager = new CollaborationManager(this.paper);
  }

  createElement(): HTMLElement {
    const container = document.createElement("div");
    container.className = "paper-editor";
    return container;
  }

  render(): void {
    this.element.innerHTML = "";

    // Header with paper name and collaborators
    const header = new EditorHeader({
      paper: this.paper,
      collaborators: this.paper.getActiveCollaborators(),
      onRename: (name: string) => this.renamePaper(name),
      onShare: () => this.showShareDialog(),
    });
    this.addChild(header);

    // Toolbar
    this.toolbar = new EditorToolbar({
      onAddSection: () => this.addSection(),
      onAddQuestion: () => this.addQuestion(),
      onPreview: () => this.togglePreview(),
      onExport: () => this.exportPaper(),
    });
    this.addChild(this.toolbar);

    // Content area
    this.contentArea = new ContentArea({
      content: this.paper.getContent(),
      onContentChange: (content: PaperContent) => this.updateContent(content),
      collaborationManager: this.collaborationManager,
    });
    this.addChild(this.contentArea);
  }

  private updateContent(content: PaperContent): void {
    this.paper.updateContent(content);
    // Auto-save
    this.autoSave();
  }

  private autoSave(): void {
    // Debounced auto-save implementation
    clearTimeout(this.autoSaveTimer);
    this.autoSaveTimer = setTimeout(() => {
      this.paper.createVersion();
    }, 2000);
  }
}
```

---

## 🔍 Search & Discovery System

### **Search Architecture**

```typescript
class SearchIndex {
  private items: Map<string, FileSystemItem>;
  private textIndex: Map<string, Set<string>>;
  private metadataIndex: Map<string, Map<string, Set<string>>>;

  constructor() {
    this.items = new Map();
    this.textIndex = new Map();
    this.metadataIndex = new Map();
  }

  addItem(item: FileSystemItem): void {
    this.items.set(item.getId(), item);
    this.indexText(item);
    this.indexMetadata(item);
  }

  private indexText(item: FileSystemItem): void {
    const content = item.getSearchableContent().toLowerCase();
    const words = content.split(/\s+/);

    words.forEach((word) => {
      if (!this.textIndex.has(word)) {
        this.textIndex.set(word, new Set());
      }
      this.textIndex.get(word)!.add(item.getId());
    });
  }

  private indexMetadata(item: FileSystemItem): void {
    const metadata = item.getSearchMetadata();

    Object.entries(metadata).forEach(([key, value]) => {
      if (!this.metadataIndex.has(key)) {
        this.metadataIndex.set(key, new Map());
      }

      const keyIndex = this.metadataIndex.get(key)!;
      const valueStr = String(value).toLowerCase();

      if (!keyIndex.has(valueStr)) {
        keyIndex.set(valueStr, new Set());
      }
      keyIndex.get(valueStr)!.add(item.getId());
    });
  }

  search(query: SearchQuery): SearchResult[] {
    const results = new Map<string, number>();

    // Text search
    query.getTerms().forEach((term) => {
      const termLower = term.toLowerCase();
      const matchingItems = this.textIndex.get(termLower) || new Set();

      matchingItems.forEach((itemId) => {
        results.set(itemId, (results.get(itemId) || 0) + 1);
      });
    });

    // Metadata search
    query.getFilters().forEach((filter) => {
      const keyIndex = this.metadataIndex.get(filter.key);
      if (keyIndex) {
        const matchingItems =
          keyIndex.get(filter.value.toLowerCase()) || new Set();
        matchingItems.forEach((itemId) => {
          results.set(itemId, (results.get(itemId) || 0) + 2); // Higher weight for metadata matches
        });
      }
    });

    // Convert to SearchResult objects and sort by relevance
    return Array.from(results.entries())
      .map(([itemId, score]) => ({
        item: this.items.get(itemId)!,
        score,
        highlights: this.getHighlights(itemId, query),
      }))
      .sort((a, b) => b.score - a.score);
  }

  private getHighlights(itemId: string, query: SearchQuery): string[] {
    const item = this.items.get(itemId);
    if (!item) return [];

    const content = item.getSearchableContent();
    const highlights: string[] = [];

    query.getTerms().forEach((term) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      const matches = content.match(regex);
      if (matches) {
        highlights.push(...matches);
      }
    });

    return highlights;
  }
}

class SearchQuery {
  private terms: string[];
  private filters: SearchFilter[];

  constructor(queryString: string) {
    this.terms = [];
    this.filters = [];
    this.parseQuery(queryString);
  }

  private parseQuery(queryString: string): void {
    const parts = queryString.split(" ");

    parts.forEach((part) => {
      if (part.includes(":")) {
        const [key, value] = part.split(":");
        this.filters.push({ key, value });
      } else {
        this.terms.push(part);
      }
    });
  }

  getTerms(): string[] {
    return this.terms;
  }
  getFilters(): SearchFilter[] {
    return this.filters;
  }

  matches(text: string): boolean {
    const textLower = text.toLowerCase();
    return this.terms.some((term) => textLower.includes(term.toLowerCase()));
  }
}
```

---

## 🤝 Collaboration System (Google Docs-like)

### **Real-time Collaboration**

```typescript
class CollaborationManager {
  private paper: QuestionPaper;
  private sessions: Map<string, CollaborationSession>;
  private operationalTransform: OperationalTransform;
  private websocket: WebSocket;

  constructor(paper: QuestionPaper) {
    this.paper = paper;
    this.sessions = new Map();
    this.operationalTransform = new OperationalTransform();
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    this.websocket = new WebSocket(
      `ws://localhost:8080/collaborate/${this.paper.getId()}`
    );

    this.websocket.onmessage = (event) => {
      const operation = JSON.parse(event.data);
      this.handleRemoteOperation(operation);
    };
  }

  addCollaborator(user: User): CollaborationSession {
    const session = this.paper.addCollaborator(user);
    this.sessions.set(user.getId(), session);

    // Notify other collaborators
    this.broadcastUserJoined(user);

    return session;
  }

  removeCollaborator(userId: string): void {
    const session = this.sessions.get(userId);
    if (session) {
      this.paper.removeCollaborator(session.getUser());
      this.sessions.delete(userId);
      this.broadcastUserLeft(session.getUser());
    }
  }

  applyOperation(operation: CollaborationOperation): void {
    // Transform operation against concurrent operations
    const transformedOp = this.operationalTransform.transform(operation);

    // Apply to local document
    this.paper.getContent().applyOperation(transformedOp);

    // Broadcast to other collaborators
    this.broadcastOperation(transformedOp);
  }

  private handleRemoteOperation(operation: CollaborationOperation): void {
    // Transform and apply remote operation
    const transformedOp = this.operationalTransform.transform(operation);
    this.paper.getContent().applyOperation(transformedOp);

    // Update UI
    this.notifyContentChanged();
  }

  private broadcastOperation(operation: CollaborationOperation): void {
    this.websocket.send(JSON.stringify(operation));
  }

  private broadcastUserJoined(user: User): void {
    this.websocket.send(
      JSON.stringify({
        type: "user_joined",
        user: user.serialize(),
      })
    );
  }

  private broadcastUserLeft(user: User): void {
    this.websocket.send(
      JSON.stringify({
        type: "user_left",
        userId: user.getId(),
      })
    );
  }

  private notifyContentChanged(): void {
    // Notify UI components to re-render
    document.dispatchEvent(
      new CustomEvent("content-changed", {
        detail: { content: this.paper.getContent() },
      })
    );
  }
}

class CollaborationSession {
  private user: User;
  private paper: QuestionPaper;
  private cursor: CursorPosition;
  private selection: SelectionRange;
  private lastActivity: Date;

  constructor(user: User, paper: QuestionPaper) {
    this.user = user;
    this.paper = paper;
    this.cursor = new CursorPosition(0, 0);
    this.selection = new SelectionRange();
    this.lastActivity = new Date();
  }

  updateCursor(position: CursorPosition): void {
    this.cursor = position;
    this.lastActivity = new Date();
    this.notifyCollaborators("cursor_moved");
  }

  updateSelection(selection: SelectionRange): void {
    this.selection = selection;
    this.lastActivity = new Date();
    this.notifyCollaborators("selection_changed");
  }

  isActive(): boolean {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.lastActivity > fiveMinutesAgo;
  }

  getUser(): User {
    return this.user;
  }
  getCursor(): CursorPosition {
    return this.cursor;
  }
  getSelection(): SelectionRange {
    return this.selection;
  }

  notify(event: string, data: any): void {
    // Handle collaboration events
    console.log(`Collaboration event: ${event}`, data);
  }

  private notifyCollaborators(event: string): void {
    // Notify other collaborators about cursor/selection changes
  }
}
```

---

## 📊 Analytics & Performance Monitoring

### **Analytics System**

```typescript
class AnalyticsManager {
  private events: AnalyticsEvent[];
  private userMetrics: UserMetrics;
  private performanceMetrics: PerformanceMetrics;

  constructor() {
    this.events = [];
    this.userMetrics = new UserMetrics();
    this.performanceMetrics = new PerformanceMetrics();
  }

  trackEvent(eventName: string, properties: object): void {
    const event = new AnalyticsEvent(eventName, properties);
    this.events.push(event);
    this.sendToAnalyticsService(event);
  }

  trackUserAction(action: UserAction): void {
    this.userMetrics.recordAction(action);
    this.trackEvent("user_action", {
      action: action.type,
      timestamp: action.timestamp,
      duration: action.duration,
    });
  }

  trackPerformance(metric: string, value: number): void {
    this.performanceMetrics.recordMetric(metric, value);
    this.trackEvent("performance_metric", {
      metric,
      value,
      timestamp: Date.now(),
    });
  }

  generateReport(): AnalyticsReport {
    return new AnalyticsReport(
      this.events,
      this.userMetrics,
      this.performanceMetrics
    );
  }

  private sendToAnalyticsService(event: AnalyticsEvent): void {
    // Send to analytics service (Google Analytics, etc.)
    if (typeof gtag !== "undefined") {
      gtag("event", event.name, event.properties);
    }
  }
}
```

---

## 🎯 Implementation Roadmap

### **Phase 1: Core OOP Foundation (Weeks 1-2)**

- [ ] Implement base Entity and FileSystemItem classes
- [ ] Create Folder and QuestionPaper classes
- [ ] Build FileSystemManager with basic operations
- [ ] Implement search functionality

### **Phase 2: UI Components (Weeks 3-4)**

- [ ] Create base UIComponent class
- [ ] Build FileExplorer component
- [ ] Implement PaperEditor with rich text editing
- [ ] Add drag-and-drop functionality

### **Phase 3: Collaboration (Weeks 5-6)**

- [ ] Implement CollaborationManager
- [ ] Add real-time editing with operational transform
- [ ] Build user presence indicators
- [ ] Create comment and suggestion system

### **Phase 4: Advanced Features (Weeks 7-8)**

- [ ] Add version history and restore
- [ ] Implement advanced search with filters
- [ ] Build analytics and reporting
- [ ] Add offline synchronization

---

## 🎨 Gemini OS Redesign Prompts

### **File Explorer Component**

```
Prompt: "Create a modern file explorer component with Google Drive-like interface. Include breadcrumb navigation, grid/list view toggle, drag-drop file organization, context menus, and search functionality. Use glassmorphism design with smooth animations."
```

### **Collaborative Editor**

```
Prompt: "Design a Google Docs-like collaborative editor for question papers. Include real-time cursor tracking, user avatars, comment system, suggestion mode, and version history. Support multilingual content with RTL languages."
```

### **Search Interface**

```
Prompt: "Build an advanced search interface with filters, suggestions, and instant results. Include search by content, metadata, file type, and date ranges. Add recent searches and saved search functionality."
```

This OOP architecture provides a scalable, maintainable foundation for Qmaker with Google Drive-like file management and Google Docs-like collaborative editing capabilities.
