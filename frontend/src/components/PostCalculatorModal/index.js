import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { postCalc, fetchCalc } from "../../store/caclulator";
import { useHistory } from "react-router-dom"
import { useModal } from '../../context/modal'



    const PostCalculatorModal = () => {
    
    
    
        const dispatch = useDispatch();
        const history = useHistory();
        const currentUser = useSelector((state) => state.session.user);
        const { openModal, closeModal } = useModal();
    
       
            const handleCreateCalculator = async () => {
             
                    const defaultCalcData = {
                        userId: currentUser.id,
                        balance: '', 
                        lumpSum: '',
                        customInstallment: '',
                        customDiscountPercentage: '',
                        customMonthlyPayment: '',
                        interestRate: ''
                    };
                    await dispatch(postCalc(defaultCalcData));
                    await dispatch(fetchCalc())
                    closeModal()
                    
                    history.push('/dashboard')
                
             
            };
    

    
        return (
            <div className="modal-content-container">
                <h2>Creating Calculator</h2>
                <p>Checking and managing calculator data...</p>
                <button onClick={handleCreateCalculator}>Create</button>
            </div>
        );
    };
    
    
        
    export default PostCalculatorModal;
