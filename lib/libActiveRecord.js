'use strict';

/**
 * Methods below are private methods  for ActiveRecords.js
 */

function _extractKeyPromptValueArrays( object ) {
    let keys = [];
    let values = [];
    let prompt = [];
    let number = 0;

    for ( let key of Object.keys( object ) ) {
        number += 1;
        keys.push( key );
        values.push( object[ key ] );
        prompt.push( `$${ number }` )
    }

    return [ keys, prompt, values ];
}

function _extractUpdateKeysValues( object ) {
    let keys = [];
    let values = [];
    let number = 1;

    for ( let key of Object.keys( object ) ) {
        number += 1;
        keys.push( key.toString() + "=$" + number );
        values.push( object[ key ] );
    }

    return [ keys, values ];
}

function _findByIdQueryBuilder( id, modelName ) {
    return ( `
        SELECT *
        FROM ${ modelName }s
        WHERE ${ modelName }_id = '${ id }';
    ` );
}

function _findOneQueryBuilder( modelName ) {
    return ( `
        SELECT *
        FROM ${ modelName }s LIMIT 1;
    ` );
}

function _findLastTenQueryBuilder( modelName ) {
    return ( `
        SELECT *
        FROM ${ modelName }s
        ORDER BY updated_at ASC LIMIT 10
        OFFSET 0;
    ` );
}

function _saveQueryBuilder( object, modelName ) {
    let [ keys, prompt, values ] = _extractKeyPromptValueArrays( object );

    return ( {
        text: `INSERT INTO ${ modelName }s (${ keys.join( ', ' ) })
               VALUES (${ prompt.join( ', ' ) }) RETURNING *`,
        values: values
    } );
}

function _updateQueryBuilder( record_id, updatedObject, modelName ) {
    let [ keys, values ] = _extractUpdateKeysValues( updatedObject );

    return ( {
        text: `UPDATE ${ modelName }s
               SET ${ keys.join( ', ' ) }
               WHERE ${ modelName }_id=$1
                   RETURNING *`,
        values: [ record_id, ...values ]
    } );
}

module.exports = {
    _findByIdQueryBuilder,
    _findOneQueryBuilder,
    _saveQueryBuilder,
    _updateQueryBuilder,
    _findLastTenQueryBuilder
};
