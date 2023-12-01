import React, {useState} from "react";
import { useDispatch } from "react-redux";
import { postCalc, fetchCalc } from "../../store/caclulator";
import { useHistory } from "react-router-dom"
import { useModal } from '../../context/modal'


const PostCalculatorModal = () => {



    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();

    useEffect(() => {
        const manageCalculator = async () => {
            // Fetch the existing calculator
            const existingCalculator = await dispatch(fetchCalc());
            if (!existingCalculator) {
                // If no calculator exists, create a new one
                const defaultCalcData = {
                    balance: 0,
                    lumpSum: 0,
                    customInstallment: 0,
                    customDiscountPercentage: 0,
                    customMonthlyPayment: 0,
                    interestRate: 0
                };
                await dispatch(postCalc(defaultCalcData));
            }
            closeModal(); // Close the modal
            history.push('/dashboard'); // Navigate to the Dashboard after closing the modal
        };

        manageCalculator();
    }, [dispatch, closeModal, history]);

    return (
        <div className="modal-content-container">
            <h2>Manage Calculator</h2>
            <p>Checking and managing calculator data...</p>
        </div>
    );
};


    
export default PostCalculatorModal;
