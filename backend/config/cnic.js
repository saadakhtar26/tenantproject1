
function validate(cnic){
    if(cnic[5]!='-' && cnic[13]!='-'){
        console.log('\n'+cnic)
        console.log('Invalid CNIC\n')
    }
    else{
        console.log('\n'+cnic)
        console.log('Valid CNIC\n')
    }
}

validate('321029363722257')
validate('32102-3637222-7')
