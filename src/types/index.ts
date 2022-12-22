export type ObjectFlags<ObjectType> = {
    [Property in keyof ObjectType]: any
}