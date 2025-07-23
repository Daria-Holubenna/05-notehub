export default interface NoteTag{
    title: string,
    content: string,
    tag: TagType,
}

export type TagType = "Todo" | "Work" | "Shopping" | "Personal" | "Meeting";