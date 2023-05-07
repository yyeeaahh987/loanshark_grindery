import { useState } from "react";

const demo = [
  {
    value: "0x71788ff18e9e100b5848fa75ca157e9a55a34108",
    label: "Demo DAO on Polygon",
    icon: "/images/icons/address-book.svg",
    group: "Address Book",
    reference: "0x71788ff18e9e100b5848fa75ca157e9a55a34108",
    insertValue: true,
    isAddressBook: true,
  },
  {
    value: "0x3be431fa62a476314812c62e2e1b263e559c5a16",
    label: "Demo DAO on Gnosis",
    icon: "/images/icons/address-book.svg",
    group: "Address Book",
    reference: "0x3be431fa62a476314812c62e2e1b263e559c5a16",
    insertValue: true,
    isAddressBook: true,
  },
];

const useAddressBook = (user: string) => {
  const cachedAddressBook = localStorage.getItem("gr_addressBook__" + user);
  const filterAddressBook = cachedAddressBook
    ? JSON.parse(cachedAddressBook).filter(
        (addr: any) => addr && !demo.map((d) => d.value).includes(addr.value)
      )
    : [];
  const [addressBook, setAddressBook] = useState([
    ...demo,
    ...filterAddressBook,
  ]);

  const addAddress = (value: { address: string; name: string }) => {
    const newAddressBook = [
      {
        value: value.address,
        label: value.name,
        icon: "/images/icons/address-book.svg",
        group: "Address Book",
        reference: value.address,
        insertValue: true,
        isAddressBook: true,
      },
      ...addressBook,
    ];
    localStorage.setItem(
      "gr_addressBook__" + user,
      JSON.stringify(newAddressBook)
    );
    setAddressBook(newAddressBook);
  };

  const editAddress = (value: { address: string; name: string }) => {
    if (value.name && value.address) {
      const newAddressBook = [
        ...addressBook.map((addr: { value: string; label: string }) => {
          if (addr.value === value.address && addr.label === value.name) {
            return {
              ...addr,
              label: value.name,
              value: value.address,
              reference: value.address,
            };
          }
          return addr;
        }),
      ];
      localStorage.setItem(
        "gr_addressBook__" + user,
        JSON.stringify(newAddressBook)
      );
      setAddressBook(newAddressBook);
    }
  };

  const deleteAddress = (value: { address: string; name: string }) => {
    const newAddressBook = [
      ...addressBook.filter(
        (address: { value: string; label: string }) =>
          address.value !== value.address && address.label !== value.name
      ),
    ];
    localStorage.setItem(
      "gr_addressBook__" + user,
      JSON.stringify(newAddressBook)
    );
    setAddressBook(newAddressBook);
  };

  return {
    addressBook,
    setAddressBook,
    addAddress,
    editAddress,
    deleteAddress,
  };
};

export default useAddressBook;
