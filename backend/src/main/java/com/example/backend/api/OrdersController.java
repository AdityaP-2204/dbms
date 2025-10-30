package com.example.backend.api;

import com.example.backend.model.Orders;
import com.example.backend.model.Transaction;
import com.example.backend.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.*;

@RequestMapping("/api/orders")
@RestController
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST})
public class OrdersController {
    private final OrdersService ordersService;

    @Autowired
    public OrdersController(OrdersService ordersService) {
        this.ordersService = ordersService;
    }

    // ✅ GET all orders with optional pagination and sorting
    @GetMapping
    public List<Orders> getAllOrders(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "order_date") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortDir
    ) {
        List<Orders> allOrders = ordersService.getAllOrders();

        // Sorting (in-memory, can later move to SQL ORDER BY)
        allOrders.sort((o1, o2) -> {
            int comparison = 0;
            switch (sortBy.toLowerCase()) {
                case "price" -> comparison = Double.compare(o1.getPrice(), o2.getPrice());
                case "quantity" -> comparison = Integer.compare(o1.getQuantity(), o2.getQuantity());
                case "order_date" -> comparison = o1.getOrder_date().compareTo(o2.getOrder_date());
            }
            return sortDir.equalsIgnoreCase("asc") ? comparison : -comparison;
        });
        return allOrders;
        // Pagination (in-memory)
        // int start = Math.min(page * size, allOrders.size());
        // int end = Math.min(start + size, allOrders.size());
        // return allOrders.subList(start, end);
    }

    @GetMapping(params = "userId")
    public List<Orders> getOrdersByUserId(@RequestParam UUID userId) {
        return ordersService.getOrdersByUserId(userId);
    }

    @GetMapping(params = "variantId")
    public List<Orders> getOrdersByVariantId(@RequestParam UUID variantId) {
        return ordersService.getOrdersByVariantId(variantId);
    }

    @GetMapping(params = "transactionId")
    public List<Orders> getOrdersByTransactionId(@RequestParam UUID transactionId) {
        return ordersService.getOrdersByTransactionId(transactionId);
    }

    @GetMapping(params = "productId")
    public List<Orders> getOrdersByProductId(@RequestParam UUID productId) {
        return ordersService.getOrdersByProductId(productId);
    }

    @GetMapping(params = "paymentStatus")
    public List<Orders> getOrdersByPaymentStatus(@RequestParam Transaction.PaymentStatus paymentStatus) {
        return ordersService.getOrdersByPaymentStatus(paymentStatus);
    }

    @GetMapping(params = "orderDate")
    public List<Orders> getOrdersByDate(@RequestParam Timestamp orderDate) {
        return ordersService.getOrdersByDate(orderDate);
    }

    @GetMapping(params = {"startDate", "endDate"})
    public List<Orders> getOrdersBetweenDates(@RequestParam Timestamp startDate, @RequestParam Timestamp endDate) {
        System.out.println("Fetching orders between " + startDate + " and " + endDate);
        return ordersService.getOrdersBetweenDates(startDate, endDate);
    }

    @PostMapping
    public int addOrder(@RequestBody Orders order) {
        return ordersService.addOrder(order);
    }
}
