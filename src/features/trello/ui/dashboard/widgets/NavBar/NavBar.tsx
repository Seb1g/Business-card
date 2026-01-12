import { useState } from "react";
import styles from "./navbar.module.scss";
import UserPopup from "../../../widgets/UserPopup/ui/UserPopup";
import AnemoneLogo from "../../../../../../shared/icons/anemone.png";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={styles.navBarContainer}>
        <div className={styles.navBarLeftside}>
          <div className={styles.navBarLogo}>
            <img src={AnemoneLogo} alt="Logo" onClick={() => navigate("/")} />
          </div>
          <div className={styles.navBarCreateBoardButton}>
            <button onClick={() => setIsModalOpen(true)}>
              Create Board
            </button>
          </div>
        </div>

        <div className={styles.navBarRightside}>
          <div className={styles.navBarUserPopup}>
            <UserPopup name={"User"} email={"example@example.com"} />
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <header className={styles.modalHeader}>
              <h3>Create new board</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>&times;</button>
            </header>
            <div className={styles.modalBody}>
              <label>Board Title</label>
              <input type="text" placeholder="Enter board name..." />
              <button className={styles.submitBtn}>Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};