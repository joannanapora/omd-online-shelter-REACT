import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import { format } from 'date-fns'
import { createStructuredSelector } from 'reselect';

import { Box, Text } from 'grommet';
import { Gallery, Previous } from 'grommet-icons';

import { getGallery } from '../../../api';

import GalleryCard from '../gallery-card/gallery-card.component';
import CustomFilterInput from '../../../shared/custom-filter-input/custom-filter-input.component';
import CustomButton from '../../../shared/custom-button/custom-button.component';
import Spinner from '../../../shared/spinner/spinner.component';
import './my-gallery.styles.scss'
import { selectCurrentUser } from '../../../store/user/user.selectors';
import CustomModal from '../../../shared/custom-modal/custom-modal.component';

const MyGallery = ({ history, user }) => {

    const [searchInput, setSearchInput] = useState("")
    const [cardList, setCardList] = useState([]);
    const [loading, setLoading]: [boolean, any] = useState(true);
    const [modalIsOpen, openModal]: [boolean, any] = useState(false);

    useEffect(() => {
        filterMyGallery();
    }, []);

    const handleSearchInput = (event) => {
        setSearchInput(event.target.value);
        filterMyGallery({ dogName: event.target.value });
    }

    const redirectToGalleryPage = () => {
        if (history)
            history.push('/gallery');
    };

    const renderSpinnerOrCards = () => {
        return loading ? <Spinner /> : renderCards();
    }

    const filterMyGallery = (params?: any) => {
        if (!params) {
            params = { userId: user.userId }
        } else {
            params = { ...params, userId: user.userId }
        }

        setLoading(true);
        getGallery(params)
            .then((response) => {
                const filteredGallery = response.data.map(image => ({
                    description: image.description,
                    title: image.dogName,
                    date: format(new Date(image.date), 'dd/MM/yyyy'),
                    key: image.id,
                    image: image.url,
                }));

                setCardList(filteredGallery);
                setLoading(false);

            }).catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    const setModal = () => {
        openModal(true)
    }

    const closeModal = () => {
        openModal(false);
    }

    const renderCards = () => {
        return (cardList.length > 0 ?
            <Box
                height="80%"
                overflow={{ horizontal: "auto", vertical: "hidden" }}
                direction="row"
                align="center"
                gap="small">
                {cardList.map(element => (
                    <GalleryCard
                        displayImageActions
                        onClick={setModal}
                        id={element.key}
                        date={element.date}
                        title={element.title}
                        description={element.description}
                        image={element.image}

                    />
                ))}
            </Box> :
            <Box
                height="80%"
                justify="center"
                pad="medium" align='center' background="white" round gap="small">
                <div className="no-image">
                    No Results
                </div>
            </Box>)
            ;
    }

    return (
        <div className='gallery'>
            {renderSpinnerOrCards()}
            <Box className='search'
                height="20%"
                border={false}
                pad="xxsmall"
                gap="small">
                <div className="search-box">
                    <div className='filter-button'>
                        <CustomButton onClick={redirectToGalleryPage} label="Go Back" icon={<Previous />} primary />
                    </div>
                    <CustomFilterInput value={searchInput} name='search-images' onChange={handleSearchInput} />
                    <div className='filter-button'><CustomButton disabled label="My Gallery" icon={<Gallery />} primary /></div>

                    {modalIsOpen && (<CustomModal
                        modalIsOpen={modalIsOpen}
                        content={
                            <div className='modal-confirmation-buttons'>
                                <Text>Are you sure you want to delete this photo?</Text>
                                <CustomButton onClick={closeModal} label="No" icon={<Gallery />} primary />
                                <CustomButton onClick={closeModal} label="Yes" icon={<Gallery />} primary />
                            </div>}
                    />)}
                </div>
            </Box>
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    user: selectCurrentUser,
});

export default withRouter(connect(
    mapStateToProps,
    null)
    (MyGallery));