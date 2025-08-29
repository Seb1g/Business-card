import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../app/store";
import {Link} from "react-router-dom";
import {useDialog} from "../lib/UseDialog.tsx";
import {addMailAddressThunk, deleteAllAddressesThunk, deleteMailAddressThunk} from "../model/manageThunks";
import {getDomainThunk, getMailAddressesThunk} from "../model/mailThunks.ts";
import {setSelectedAddress} from "../model/mailSlice.ts";
import "./manage.scss";
import {clearAddMailAddressError} from "../model/manageSlice.ts";

export const Manage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {addresses, selectedAddress, domainName} = useAppSelector((state) => state.mail);
  const {showAlert, showConfirm, dialogComponent} = useDialog();

  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    dispatch(getMailAddressesThunk());
    dispatch(getDomainThunk());
  }, [dispatch]);

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    if (newAddress.length <= 2) {
      await showAlert("Invalid email address.");
      setNewAddress("");
      return
    }

    const status= await dispatch(addMailAddressThunk({address: newAddress}));
    console.log(status);

    if (status.meta.requestStatus === "rejected") {
      await showAlert("Address already exists.");
      setNewAddress("");
      clearAddMailAddressError();
    } else {
      await showAlert("Successfully added!");
      setNewAddress("");
      dispatch(getMailAddressesThunk());
    }
  };

  const handleDeleteAddress = async () => {
    if (!selectedAddress) return;
    const confirmed = await showConfirm("Delete this address?");
    if (confirmed) {
      await dispatch(deleteMailAddressThunk({id: selectedAddress}));
      dispatch(getMailAddressesThunk());
      await showAlert("Done.");
    }
  };

  const handleDeleteAll = async () => {
    if (!selectedAddress) return;
    const confirmed = await showConfirm("Delete ALL addresses?");
    if (confirmed) {
      await dispatch(deleteAllAddressesThunk());
      dispatch(getMailAddressesThunk());
      await showAlert("Done.");
    }
  };

  return (
    <main className="manage">
      {dialogComponent}
      <div className="manage__container">
        <h2>Manage Addresses</h2>

        {/* Новый адрес */}
        <div className="manage__new">
          <input
            type="text"
            placeholder="Enter new address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <span>{domainName !== null ? `@${domainName.domain}` : "Error"}</span>
          <button onClick={handleAddAddress} className="manage__btn">
            Add
          </button>
        </div>

        {/* Список адресов */}
        <select
          value={selectedAddress}
          onChange={(e) => {
            const newAddress = e.target.value;
            if (newAddress) {
              dispatch(setSelectedAddress(newAddress));
            }
          }}
          style={{flex: 1}}>
          {addresses && addresses.length > 0 && addresses.map((address: string) => (
            <option key={address} value={address}>{address}@7ty2ryz3.ru</option>
          ))}
        </select>

        {/* Действия */}
        <div className="manage__actions">
          <button onClick={handleDeleteAddress} className="manage__btn manage__btn--danger">
            Delete One
          </button>
          <button onClick={handleDeleteAll} className="manage__btn manage__btn--danger">
            Delete All
          </button>
          <Link to="/mail">
            <button className="manage__btn">Back</button>
          </Link>
        </div>
      </div>
    </main>
  );
};
