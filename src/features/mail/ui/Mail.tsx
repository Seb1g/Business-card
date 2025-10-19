import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../app/store';
import {mod} from '../lib/mailHelpers';
import {createNewMailThunk, getInboxThunk} from "../model/mailThunks.ts";
import "./mail.scss";
import {type InboxInterface, type MailInterface, setSelectedAddress, setSelectedEmail} from "../model/mailSlice.ts";

interface UserData {
  address: string;
  token: string;
}

const loadTokens = (): UserData[] => {
  const tokens: UserData[] = [];
  for (let i = 1; i <= 50; i++) {
    const key = `token${i}`;
    const userString = localStorage.getItem(key);
    if (userString !== null) {
      try {
        const user = JSON.parse(userString);
        if (user && user.token) {
          tokens.push({address: user.address, token: user.token});
        }
      } catch (e) {
        console.error(`Ошибка парсинга JSON для ${key}`, e);
      }
    }
  }
  return tokens;
};

const SECONDARY_COLOR = '#6c757d';
const TERTIARY_COLOR = '#fa5246';
const ACCENT_COLOR = '#28a745';
const BACKGROUND_COLOR = '#f8f9fa';
const PANEL_BACKGROUND = '#ffffff';
const BORDER_COLOR = '#dee2e6';
const FONT_FAMILY = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';


const EmailModal: React.FC<{ email: InboxInterface; onClose: () => void }> = ({email, onClose}) => {

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1000,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: FONT_FAMILY,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: PANEL_BACKGROUND,
    padding: '30px',
    border: 'none',
    width: '90%',
    maxWidth: '800px',
    overflowY: 'auto',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    position: 'relative',
    margin: window.innerWidth < 600 ? '20px' : '0 auto',
    maxHeight: window.innerWidth < 600 ? '95vh' : '85vh',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    fontSize: '32px',
    fontWeight: 'normal',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    color: SECONDARY_COLOR,
    lineHeight: '1',
  };

  const modalHeaderStyle: React.CSSProperties = {
    borderBottom: `1px solid ${BORDER_COLOR}`,
    paddingBottom: '15px',
    marginBottom: '15px',
  };

  return (
    <div style={modalStyle} onClick={handleBackdropClick}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={closeButtonStyle}>&times;</button>
        <div style={modalHeaderStyle}>
          <h3 style={{margin: 0, fontSize: '1.25rem'}}>Тема: {email.subject}</h3>
          <p style={{margin: '8px 0 0 0', fontSize: '1rem'}}><strong>Отправитель:</strong> {email.sender}</p>
          <p style={{margin: '4px 0 0 0', fontSize: '0.9rem', color: SECONDARY_COLOR}}>
            <strong>Получатели:</strong> {email.recipients.join(', ')}</p>
          <p style={{margin: '4px 0 0 0', fontSize: '0.9rem', color: SECONDARY_COLOR}}>
            <strong>Дата:</strong> {new Date(email.received_at).toLocaleString()}</p>
        </div>
        <div dangerouslySetInnerHTML={{__html: email.body}}/>
      </div>
    </div>
  );
};

export const Mail: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    inbox,
    inboxLoading,
    inboxError,
    selectedAddress,
    selectedEmail
  } = useAppSelector((state) => state.mail);
  const [emails, setEmails] = useState<UserData[]>([]);
  const [hoveredMailId, setHoveredMailId] = useState<string | null>(null);

  useEffect(() => {
    setEmails(loadTokens());
  }, []);

  const handleCopyClick = () => {
    if (selectedAddress) {
      mod.copyToClipboard(selectedAddress.address).then(r => console.log(r));
    }
  };

  const handleDeleteClick = (): void => {
    let selectedUserKey: string = ""
    for (let i = 1; i <= 50; i++) {
      const userDataString = localStorage.getItem(`token${i}`)

      if (userDataString !== null) {
        const userData: MailInterface = JSON.parse(userDataString);
        if (selectedAddress !== null && userData.address === selectedAddress.address) {
          selectedUserKey = `token${i}`
          break
        }
      } else {
        console.log("error")
      }
    }
    localStorage.removeItem(selectedUserKey)
    setEmails(loadTokens());
    dispatch(setSelectedAddress(emails[1]))
  }

  const switchMailHandler = (address: string, token: string) => {
    const dataPush: MailInterface = {
      address: address,
      token: token,
    }
    dispatch(setSelectedAddress(dataPush));
    dispatch(getInboxThunk({token: dataPush.token}));
  }

  const createEmailHandler = async () => {
    await dispatch(createNewMailThunk())
    setEmails(loadTokens());
  }

  const handleEmailClick = (email: InboxInterface) => {
    dispatch(setSelectedEmail(email));
  };

  const handleCloseModal = () => {
    dispatch(setSelectedEmail(null));
  };

  const listItemBaseStyle: React.CSSProperties = {
    padding: '12px 15px',
    borderBottom: `1px solid ${BORDER_COLOR}`,
    cursor: 'pointer',
    backgroundColor: PANEL_BACKGROUND,
    transition: 'background-color 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderRadius: '4px',
    marginBottom: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  };

  const mainContainerStyle: React.CSSProperties = {
    maxWidth: window.innerWidth < 600 ? '95%' : '1000px',
    margin: '0 auto',
    padding: '15px',
    backgroundColor: PANEL_BACKGROUND,
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  const addressBarStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
    gap: '10px',
    alignItems: 'stretch',
    borderBottom: `1px solid ${BORDER_COLOR}`,
    paddingBottom: '20px'
  };

  return (
    <main
      className="mail"
      style={{
        backgroundColor: BACKGROUND_COLOR,
        minHeight: '100vh',
        padding: window.innerWidth < 600 ? '20px 0' : '40px 0',
        fontFamily: FONT_FAMILY
      }}
    >
      <div className="mail__container" style={mainContainerStyle}>

        <div className="mail__address-bar" style={addressBarStyle}>
          <select
            style={{
              padding: '10px 15px',
              borderRadius: '6px',
              border: `1px solid ${BORDER_COLOR}`,
              flexGrow: 1,
              fontSize: '16px',
              backgroundColor: PANEL_BACKGROUND,
              width: window.innerWidth < 768 ? '100%' : 'auto',
              fontFamily: FONT_FAMILY,
              fontWeight: 600
            }}
            value={selectedAddress?.token || 'SELECT_ADDRESS'}
            onChange={async (event) => {
              const selectedValue = event.target.value;
              if (selectedValue === 'CREATE_NEW') {
                await createEmailHandler();
                event.target.value = 'SELECT_ADDRESS';
              } else if (selectedValue !== 'SELECT_ADDRESS' && selectedValue !== '') {
                const selectedEmailData = emails.find(e => e.token === selectedValue);
                if (selectedEmailData) {
                  switchMailHandler(selectedEmailData.address, selectedValue);
                }
              }
            }}
          >
            <option value="SELECT_ADDRESS" disabled>Select address</option>
            {emails.map(e => (
              <option key={e.token} value={e.token}>
                {e.address}
              </option>
            ))}
            <option value="CREATE_NEW" style={{fontWeight: 600, color: ACCENT_COLOR}}>
              Create New Address
            </option>
          </select>

          <button
            onClick={handleCopyClick}
            className="mail__btn"
            style={{
              padding: '10px 15px',
              borderRadius: '6px',
              backgroundColor: SECONDARY_COLOR,
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              width: window.innerWidth < 768 ? '100%' : '120px',
              fontWeight: 500
            }}
          >
            Copy
          </button>
          <button
            onClick={handleDeleteClick}
            className="mail__btn"
            style={{
              padding: '10px 15px',
              borderRadius: '6px',
              backgroundColor: TERTIARY_COLOR,
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              width: window.innerWidth < 768 ? '100%' : '120px',
              fontWeight: 500
            }}
            disabled={selectedAddress === null}
          >
            Delete
          </button>
        </div>

        {inboxError && <p style={{color: 'red', padding: '10px', backgroundColor: '#fdd', borderRadius: '6px'}}>Ошибка
            загрузки: {inboxError}</p>}
        {inboxLoading && <p style={{padding: '10px', color: SECONDARY_COLOR}}>Загрузка писем...</p>}
        {selectedAddress === null && <p style={{
          padding: '15px',
          backgroundColor: '#fff3cd',
          color: '#856404',
          borderRadius: '6px',
          border: '1px solid #ffeeba'
        }}>Выберите или создайте адрес для просмотра писем.</p>}


        {inbox && inbox.length > 0 && (
          <div style={{marginTop: '10px'}}>
            <div style={{maxHeight: '60vh', overflowY: 'auto'}}>
              {inbox.map((mail) => (
                <div
                  key={mail.id}
                  style={{
                    ...listItemBaseStyle,
                    backgroundColor: hoveredMailId === String(mail.id) ? '#e9ecef' : (selectedEmail?.id === mail.id ? '#f0f8ff' : PANEL_BACKGROUND),
                    boxShadow: hoveredMailId === String(mail.id) ? '0 2px 6px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                  onClick={() => handleEmailClick(mail)}
                  onMouseEnter={() => setHoveredMailId(String(mail.id))}
                  onMouseLeave={() => setHoveredMailId(null)}
                >
                  <strong style={{fontSize: '1.1em', color: '#333', fontWeight: 600}}>Тема: {mail.subject}</strong>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.9em',
                    color: SECONDARY_COLOR
                  }}>
                    <span>Отправитель: {mail.sender}</span>
                    <span>{new Date(mail.received_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {inbox && inbox.length === 0 && !inboxLoading && selectedAddress && (
          <p style={{padding: '20px', textAlign: 'center', color: SECONDARY_COLOR}}>В ящике нет писем.</p>
        )}

        {selectedEmail && (
          <EmailModal email={selectedEmail} onClose={handleCloseModal}/>
        )}
      </div>
    </main>
  );
};
