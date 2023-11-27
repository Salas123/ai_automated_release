export function GetTicketDescriptions(tickets){
    return tickets.map((ticket) => {
        return ticket.description;
    })
}
