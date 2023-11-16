function validateTicketStatus ({...props}){
    const tickets = props.tickets;
    const status = props.statusToBe;

    for(let i = 0; i < tickets.length; i++)
        if(tickets[i].fields.status.name !== status)
            return false;

    return true;
}

export default validateTicketStatus;
