import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../../app/store';
import {useDialog} from '../lib/UseDialog.tsx';
import {Link} from "react-router-dom";
import {mod} from '../lib/mailHelpers';
import trashIcon from "../../../shared/icons/trashIcon.svg";
import {
  deleteOneMailThunk,
  getDomainThunk,
  getMailAddressesThunk,
  getMailDataThunk,
  mailsListThunk
} from "../model/mailThunks";
import {clearMailData, setPage, setSelectedAddress} from "../model/mailSlice";
import "./mail.scss";

export const Mail: React.FC = () => {
  const dispatch = useAppDispatch();
  const {domainName, addresses, selectedAddress, mails, page, mailData} = useAppSelector((state) => state.mail);
  const {showConfirm, dialogComponent} = useDialog();

  useEffect(() => {
    dispatch(getMailAddressesThunk());
    dispatch(getDomainThunk());
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(ччч()).then((result: any) => {
  //     const refreshInterval = (result.payload as number) * 1000;
  //     const intervalId = setInterval(() => {
  //       if (selectedAddress) {
  //         dispatch(mailsListThunk({ addr: selectedAddress, page }));
  //       }
  //     }, refreshInterval);
  //     return () => clearInterval(intervalId);
  //   });
  // }, [dispatch, page, selectedAddress]);

  useEffect(() => {
    if (selectedAddress !== "") {
      dispatch(mailsListThunk({addr: selectedAddress, page}));
    }
  }, [selectedAddress, page, dispatch]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAddress = e.target.value;
    dispatch(setSelectedAddress(newAddress));
    dispatch(setPage(1));
    localStorage.setItem("address", newAddress);
  };

  const handleMailClick = (id: string) => {
    dispatch(getMailDataThunk({id}));
  };

  const handleDeleteClick = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const confirmed = await showConfirm("Delete this email?");
    if (confirmed) {
      await dispatch(deleteOneMailThunk({id}));
      dispatch(mailsListThunk({addr: selectedAddress!, page}));
    }
  };

  const handleBackClick = () => {
    dispatch(clearMailData());
  };

  const handleCopyClick = () => {
    if (selectedAddress) {
      mod.copyToClipboard(selectedAddress + domainName).then(r => console.log(r));
    }
  };

  return (
    <main className="mail">
      {dialogComponent}
      <div className="mail__container">

        {/* Адрес */}
        <div className="mail__address-bar">
          <select value={selectedAddress} onChange={handleAddressChange}>
            {addresses && addresses.length > 0 && addresses.map((address) => (
              <option key={address} value={address}>{address}</option>
            ))}
          </select>
          <span>{domainName ? `@${domainName.domain}` : "Error"}</span>
          <button onClick={handleCopyClick} className="mail__btn">Copy</button>
        </div>

        {/* Список писем */}
        <div className="mail__list">
          {!mailData && mails !== null ? (
            mails.map((mail) => (
              <div
                key={mail.id}
                className="mail__item"
                onClick={() => handleMailClick(mail.id)}
              >
                <div className="mail__info">
                  <span>{mail.sender}</span>
                  <span>{mail.subject}</span>
                </div>
                <img
                  src={trashIcon}
                  alt="delete"
                  className="mail__delete"
                  onClick={(e) => handleDeleteClick(mail.id, e)}
                />
              </div>
            ))
          ) : selectedAddress === "" ? (
            <div className="mail__detail"
                 style={{
                   alignItems: "center",
                 }}
            >
              <span>Mail Address not Selected</span>
            </div>
          ) : (
            <div className="mail__detail">
              <span>{mailData?.sender ?? "Error"}</span>
              <span>{mailData?.subject ?? "Error"}</span>
              <hr/>
              <div
                className="mail__content"
                dangerouslySetInnerHTML={{__html: mailData?.content ?? "Error"}}
              />
              <button onClick={handleBackClick} className="mail__btn">Back</button>
            </div>
          )}
        </div>

        {/* Пагинация */}
        <div className="mail__pagination">
          <button onClick={() => dispatch(setPage(Math.max(1, page - 1)))}>❮</button>
          <span>{page}</span>
          <button onClick={() => dispatch(setPage(page + 1))}>❯</button>
        </div>

        <Link to="/mail/manage">
          <button className="mail__btn">Manage addresses</button>
        </Link>
      </div>
    </main>
  );
};
