import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import NoteCard from "../../components/cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/toastMessage/Toast";
import EmptyCard from "../../components/empty/EmptyCard";

function Home() {
  const [openEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  // const [showToastMsg, setShowToastMsg] = useState({
  //   isShown: false,
  //   message: "",
  //   type: "add",
  // });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const [isSearch, setIsSearch] = useState(false);

  const handleEdit = (notedetails) => {
    // this data -> noteData
    setOpenAddEditModal({ isShown: true, data: notedetails, type: "edit" });
  };

  // const showToastMessage = (message, type) => {
  //   setShowToastMsg({
  //     isShown: true,
  //     message: message,
  //     type: type,
  //   });
  // };
  // const handleCloseToast = () => {
  //   setShowToastMsg({
  //     isShown: false,
  //     message: "",
  //   });
  // };

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get All Notes (in inspect -> Network)
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes/");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An error occured");
    }
  };

  // Delete Note API
  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An error occured");
      }
    }
  };

  // Search API call
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes/", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("search error::", error);
    }
  };

  // To clear search results
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const updateisPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId,
        {
          isPinned: !noteData.isPinned,
        }
      );

      if (response.data && response.data.note) {
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <>
      {/* this userInfo needed for personalInfo */}
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 m-8">
            {/* rendering all the notes of the user */}

            {allNotes.map((item, index) => (
              <NoteCard
                key={item._id}
                title={item.title}
                content={item.content}
                date={item.createdOn}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateisPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard />
        )}
      </div>

      {/* ( + ) button */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openEditModal.type}
          noteData={openEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
        />
      </Modal>

      {/* Toast msg */}
      {/* <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      /> */}
    </>
  );
}

export default Home;
