package com.example.backend.api;

import com.example.backend.model.Transaction;
import com.example.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RequestMapping("/api/transaction")
@RestController
@CrossOrigin(
        origins = "http://localhost:5173",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE}
)
public class TransactionController {
    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public UUID addTransaction(@RequestBody Transaction transaction) {
        return transactionService.addTransaction(transaction);
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping(params = "userId")
    public List<Transaction> getTransactionsByUserId(@RequestParam UUID userId) {
        return transactionService.getTransactionsByUserId(userId);
    }

    @GetMapping(params = "status")
    public List<Transaction> getTransactionsByStatus(@RequestParam Transaction.PaymentStatus status) {
        return transactionService.getTransactionsByStatus(status);
    }

    @GetMapping(params = "date")
    public List<Transaction> getTransactionsByDate(@RequestParam Timestamp date) {
        return transactionService.getTransactionsByDate(date);
    }

    @GetMapping(params = {"startDate", "endDate"})
    public List<Transaction> getTransactionsBetweenDates(@RequestParam Timestamp startDate,
                                                         @RequestParam Timestamp endDate) {
        return transactionService.getTransactionsBetweenDates(startDate, endDate);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateTransactionStatus(@PathVariable("id") UUID transactionId, @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status");
            Transaction.PaymentStatus paymentStatus = Transaction.PaymentStatus.valueOf(status);
            int result = transactionService.updateTransactionStatus(transactionId, paymentStatus);
            
            if (result > 0) {
                return ResponseEntity.ok("Transaction status updated successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid payment status");
        }
    }
}
