const fields = ['second', 'minute', 'hour', 'day', 'month', 'week'];
const pluralFields = ['seconds', 'minutes', 'hours', 'days', 'months', 'weeks'];
const validCommands = ['every', 'on', 'from']
const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sunday', 'monday', 'tuesday', 
    'wednesday', 'thursday', 'friday', 'saturday'];
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 
    'november', 'december'];

function readNextCommand(commands){
    let command = commands[0];
    switch(command){
        case 'every':
            if(validCommands.indexOf(commands[2]) >= 0){
                return commands.slice(0, 2);
            } else {
                return commands.slice(0, 3);
            }
        case 'on':
            return commands.slice(0, 3);
        case 'from':
            if(commands.indexOf('week') > 0)
                return commands.slice(0, 6);
            return commands.slice(0, 5);
        default:
            throw `invalid expression at ${command}`
    }
}

function applyDefaultValues(field, cron){
    switch(field){
        case 'second':
            if(!cron[fields.indexOf('week')]) cron[fields.indexOf('week')] = '*';
            if(!cron[fields.indexOf('month')]) cron[fields.indexOf('month')] = '*';
            if(!cron[fields.indexOf('day')]) cron[fields.indexOf('day')] = '*'; 
            if(!cron[fields.indexOf('hour')]) cron[fields.indexOf('hour')] = '*';    
            if(!cron[fields.indexOf('minute')]) cron[fields.indexOf('minute')] = '*';
            break;
        case 'minute':
            if(!cron[fields.indexOf('week')]) cron[fields.indexOf('week')] = '*';
            if(!cron[fields.indexOf('month')]) cron[fields.indexOf('month')] = '*';
            if(!cron[fields.indexOf('day')]) cron[fields.indexOf('day')] = '*'; 
            if(!cron[fields.indexOf('hour')]) cron[fields.indexOf('hour')] = '*';    
            if(!cron[fields.indexOf('second')]) cron[fields.indexOf('second')] = '0';
            break;
        case 'hour':
            if(!cron[fields.indexOf('week')]) cron[fields.indexOf('week')] = '*';
            if(!cron[fields.indexOf('month')]) cron[fields.indexOf('month')] = '*';
            if(!cron[fields.indexOf('day')]) cron[fields.indexOf('day')] = '*'; 
            if(!cron[fields.indexOf('minute')]) cron[fields.indexOf('minute')] = '0';    
            if(!cron[fields.indexOf('second')]) cron[fields.indexOf('second')] = '0';
            break;
        case 'day':
            if(!cron[fields.indexOf('week')]) cron[fields.indexOf('week')] = '*';
            if(!cron[fields.indexOf('month')]) cron[fields.indexOf('month')] = '*';
            if(!cron[fields.indexOf('hour')]) cron[fields.indexOf('hour')] = '0'; 
            if(!cron[fields.indexOf('minute')]) cron[fields.indexOf('minute')] = '0';    
            if(!cron[fields.indexOf('second')]) cron[fields.indexOf('second')] = '0';
            break;
        case (months.filter(m => field.toLowerCase().indexOf(m) >= 0).join(',').indexOf(field) >= 0 ? field: 'month'):
            if(!cron[fields.indexOf('week')]) cron[fields.indexOf('week')] = '*';
            if(!cron[fields.indexOf('day')]) cron[fields.indexOf('day')] = '1';
            if(!cron[fields.indexOf('hour')]) cron[fields.indexOf('hour')] = '0'; 
            if(!cron[fields.indexOf('minute')]) cron[fields.indexOf('minute')] = '0';    
            if(!cron[fields.indexOf('second')]) cron[fields.indexOf('second')] = '0';
            break;
        case (weekDays.filter(d => field.toLowerCase().indexOf(d) >= 0).join(',').indexOf(field) >= 0 ? field: 'week'):
            if(!cron[fields.indexOf('month')]) cron[fields.indexOf('month')] = '*';
            if(!cron[fields.indexOf('day')]) cron[fields.indexOf('day')] = '*';
            if(!cron[fields.indexOf('hour')]) cron[fields.indexOf('hour')] = '0'; 
            if(!cron[fields.indexOf('minute')]) cron[fields.indexOf('minute')] = '0';    
            if(!cron[fields.indexOf('second')]) cron[fields.indexOf('second')] = '0';
            break;
    }
}

function applyCommand(cron, command){
    switch(command[0]){
        case 'every':
            if(command.length === 2){ // every [field]
                applyDefaultValues(command[1], cron);
                // apply week day
                if(command[1] === 'week'){
                    cron[fields.indexOf(command[1])] = '0';
                } else if(weekDays.filter(d => command[1].toLowerCase().indexOf(d) >= 0).join(',').indexOf(command[1]) >= 0) {
                    cron[fields.indexOf('week')] = command[1].toLowerCase();
                } else if(months.filter(m => command[1].toLowerCase().indexOf(m) >= 0).join(',').indexOf(command[1]) >= 0) {
                    cron[fields.indexOf('month')] = command[1].toLowerCase();
                } else {
                    cron[fields.indexOf(command[1])] = '*';
                }
            } else if(fields.indexOf(command[1]) >= 0){ // every [field] [value]
                applyDefaultValues(command[1], cron);
                cron[fields.indexOf(command[1])] = command[2];
            } else { // every [value] [field]
                applyDefaultValues(command[2], cron);
                cron[fields.indexOf(command[2])] = `*/${command[1]}`
            }
            break;
        case 'on':
            applyDefaultValues(command[1], cron);
            if(weekDays.indexOf(command[1]) >= 0) {
                cron[fields.indexOf('week')] = command[1].toLowerCase();
            } else if(months.indexOf(command[1]) >= 0) {
                cron[fields.indexOf('month')] = command[1].toLowerCase();
            } else {
                cron[fields.indexOf(command[1])] = command[2];
            }
            break;
        case 'from':
            applyDefaultValues(command[1], cron);
            if(command[1] === 'week')
                cron[fields.indexOf(command[1])] = `${command[3]}-${command[5]}`
            else if(months.filter(m => command[1].toLowerCase().indexOf(m) >= 0).join(',').indexOf(command[1]) >= 0)
                cron[fields.indexOf('month')] = `${command[1]}-${command[3]}`
            else if(weekDays.filter(d => command[1].toLowerCase().indexOf(d) >= 0).join(',').indexOf(command[1]) >= 0)
                cron[fields.indexOf('week')] = `${command[1]}-${command[3]}`
            else
               cron[fields.indexOf(command[1])] = `${command[2]}-${command[4]}`
            break;
    }
}

module.exports = (() => {
    const toCron = (expression) => {
        // replace all plural fields to singular
        pluralFields.forEach((item, index) => {
            expression = expression.replace(new RegExp(item, 'g'), fields[index]);
        });

        let commands = expression.split(' ');
        let cron = [];

        while(commands.length > 0){
            let nextCommand = readNextCommand(commands);
            applyCommand(cron, nextCommand);
            commands = commands.slice(nextCommand.length);
        }

        let cronExpression = cron.join(' ').trim();
        if(!cronExpression){
            throw 'Invalid expression!'
        }
        return cronExpression;
    }
    return toCron;
})();