
const formatAddress = (address: string) => {
    return address ? address.substring(0, 4) + "•••" + address.substring(address.length - 4, address.length) : null;
}

export default formatAddress;