import type { DMMF } from '@prisma/generator-helper'

export interface TransformOptions {
    keepRelationScalarFields?: 'true' | 'false'
    schemaId?: string
}

export function transformDMMF(
    dmmf: DMMF.Document,
    transformOptions: TransformOptions = {},
): string {
    // TODO: Remove default values as soon as prisma version < 3.10.0 doesn't have to be supported anymore
    const { models = [], enums = [], types = [] } = dmmf.datamodel
    let x = JSON.stringify(dmmf, null, 2)
    console.log(x.slice(x.indexOf('xxx'), x.indexOf('xxx') + 100))
    const typeDefinitionsMap = [...types, ...models].map(
        (model: DMMF.Model): string => {
            // const relationFromFields = model.fields.flatMap(
            //     (field) => field.relationFromFields || [],
            // )

            const propertiesMap = model.fields
                .filter((x) => {
                    // console.log(x)
                    return !x.relationName
                })
                .map((field) => {
                    const property = isSingleReference(field)
                        ? field.type
                        : getPropertyDefinition(field)
                    return `${field.name}${
                        field.isRequired ? ':' : '?:'
                    } ${property}`
                })

            return `export interface ${model.name} {\n  ${propertiesMap.join(
                '\n  ',
            )}\n}`
        },
    )
    const enumsCode = enums.map((enumType) => {
        return `export type ${enumType.name} = ${enumType.values
            .map((value) => `'${value.name}'`)
            .join(' | ')}`
    })

    return typeDefinitionsMap.join('\n\n') + '\n\n' + enumsCode.join('\n\n')
}

function getPropertyDefinition(field: DMMF.Field) {
    const { isList, isRequired } = field

    const type = (() => {
        if (isScalarType(field) && !isList) {
            return getScalar(field.type)
        }
        if (field.isList) {
            return getScalar(field.type as any) + '[]'
        }
        if (isEnumType(field)) {
            // console.log('enum', field)
            return field.type
        }
        return 'any'
    })()

    return `${type}`
}

export function isScalarType(field: DMMF.Field) {
    return field['kind'] === 'scalar'
}

export function isEnumType(field: DMMF.Field): boolean {
    return field['kind'] === 'enum'
}

function getScalar(fieldType: string): string {
    switch (fieldType) {
        case 'Int':
        case 'BigInt':
            return 'number'
        case 'DateTime':
        case 'Bytes':
        case 'String':
            return 'string'
        case 'Float':
        case 'Decimal':
            return 'number'
        case 'Json':
            return 'any'
        case 'Boolean':
            return 'boolean'
        default:
            return fieldType
    }
}

function isSingleReference(field: DMMF.Field) {
    return !isScalarType(field) && !field.isList && !isEnumType(field)
}
